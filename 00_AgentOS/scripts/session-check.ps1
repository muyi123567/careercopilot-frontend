[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$RepoPath,

    [Parameter(Mandatory = $true)]
    [string]$TaskFile
)

$ErrorActionPreference = 'Stop'

function Get-FrontmatterValue {
    param(
        [string[]]$Lines,
        [string]$Key
    )

    $match = $Lines | Select-String -Pattern ("^{0}:\s*(.*)$" -f [regex]::Escape($Key)) | Select-Object -First 1
    if (-not $match) {
        return $null
    }

    return $match.Matches[0].Groups[1].Value.Trim().Trim('"').Trim("'")
}

$repo = (Resolve-Path -LiteralPath $RepoPath).Path
$task = (Resolve-Path -LiteralPath $TaskFile).Path

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw 'git is not available on PATH.'
}

$insideWorktree = (& git -C $repo rev-parse --is-inside-work-tree 2>$null)
if ($LASTEXITCODE -ne 0 -or $insideWorktree -ne 'true') {
    throw "RepoPath is not a Git worktree: $repo"
}

$taskLines = Get-Content -LiteralPath $task
if ($taskLines.Count -lt 3 -or $taskLines[0].Trim() -ne '---') {
    throw "Task file has no YAML frontmatter: $task"
}

$closingDelimiter = -1
for ($index = 1; $index -lt $taskLines.Count; $index++) {
    if ($taskLines[$index].Trim() -eq '---') {
        $closingDelimiter = $index
        break
    }
}

if ($closingDelimiter -lt 0) {
    throw "Task frontmatter is not closed: $task"
}

$frontmatter = $taskLines[1..($closingDelimiter - 1)]
$requiredFields = @('id', 'type', 'project', 'title', 'status', 'priority', 'risk', 'acceptance', 'verification', 'created', 'updated')
$missingFields = @()

foreach ($field in $requiredFields) {
    if (-not ($frontmatter | Select-String -Pattern ("^{0}:" -f [regex]::Escape($field)) -Quiet)) {
        $missingFields += $field
    }
}

if ($missingFields.Count -gt 0) {
    throw "Task frontmatter is missing required fields: $($missingFields -join ', ')"
}

$taskId = Get-FrontmatterValue -Lines $frontmatter -Key 'id'
$title = Get-FrontmatterValue -Lines $frontmatter -Key 'title'
$status = Get-FrontmatterValue -Lines $frontmatter -Key 'status'
$owner = Get-FrontmatterValue -Lines $frontmatter -Key 'owner'
$risk = Get-FrontmatterValue -Lines $frontmatter -Key 'risk'
$expectedBranch = Get-FrontmatterValue -Lines $frontmatter -Key 'branch'
$currentBranch = (& git -C $repo branch --show-current).Trim()

$allowedStatuses = @('backlog', 'ready', 'claimed', 'in_progress', 'review', 'verified', 'done', 'blocked', 'cancelled')
if ($status -notin $allowedStatuses) {
    throw "Task has invalid status '$status'."
}

if ($risk -notin @('L0', 'L1', 'L2', 'L3')) {
    throw "Task has invalid risk '$risk'."
}

$priority = Get-FrontmatterValue -Lines $frontmatter -Key 'priority'
if ($priority -notin @('P0', 'P1', 'P2', 'P3')) {
    throw "Task has invalid priority '$priority'."
}

$stateRequirements = @{}
if ($status -in @('claimed', 'in_progress', 'review')) {
    $stateRequirements = @{
        owner      = $owner
        claimed_at = Get-FrontmatterValue -Lines $frontmatter -Key 'claimed_at'
        lease_until = Get-FrontmatterValue -Lines $frontmatter -Key 'lease_until'
        branch     = $expectedBranch
        worktree   = Get-FrontmatterValue -Lines $frontmatter -Key 'worktree'
    }
}

if ($status -eq 'review') {
    $stateRequirements.commit = Get-FrontmatterValue -Lines $frontmatter -Key 'commit'
}

if ($status -in @('verified', 'done')) {
    $stateRequirements = @{
        reviewer = Get-FrontmatterValue -Lines $frontmatter -Key 'reviewer'
        commit   = Get-FrontmatterValue -Lines $frontmatter -Key 'commit'
    }
}

$missingStateFields = @($stateRequirements.GetEnumerator() | Where-Object { [string]::IsNullOrWhiteSpace([string]$_.Value) } | ForEach-Object Key)
if ($missingStateFields.Count -gt 0) {
    throw "Task status '$status' requires values for: $($missingStateFields -join ', ')"
}

Write-Host '=== Task ===' -ForegroundColor Cyan
[pscustomobject]@{
    Id             = $taskId
    Title          = $title
    Status         = $status
    Risk           = $risk
    Owner          = $owner
    ExpectedBranch = $expectedBranch
    CurrentBranch  = $currentBranch
} | Format-List

if ($expectedBranch -and $expectedBranch -ne $currentBranch) {
    Write-Warning "Current branch '$currentBranch' does not match task branch '$expectedBranch'."
}

Write-Host '=== Git Status ===' -ForegroundColor Cyan
$statusOutput = & git -C $repo status --short --branch
if ($statusOutput) {
    $statusOutput
} else {
    Write-Host '(clean)'
}

Write-Host '=== Recent Commits ===' -ForegroundColor Cyan
& git -C $repo log -5 --oneline --decorate

Write-Host '=== Worktrees ===' -ForegroundColor Cyan
& git -C $repo worktree list

Write-Host '=== Applicable Agent Instructions ===' -ForegroundColor Cyan
$repoRoot = (& git -C $repo rev-parse --show-toplevel).Trim()
$directories = @()
$cursor = Get-Item -LiteralPath $repo

while ($cursor -and $cursor.FullName.StartsWith($repoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    $directories = @($cursor.FullName) + $directories
    if ($cursor.FullName -eq $repoRoot) {
        break
    }
    $cursor = $cursor.Parent
}

$instructionFiles = foreach ($directory in $directories) {
    $override = Join-Path $directory 'AGENTS.override.md'
    $standard = Join-Path $directory 'AGENTS.md'
    if (Test-Path -LiteralPath $override -PathType Leaf) {
        $override
    } elseif (Test-Path -LiteralPath $standard -PathType Leaf) {
        $standard
    }
}

if ($instructionFiles) {
    $instructionFiles
} else {
    Write-Warning 'No AGENTS.md or AGENTS.override.md found in the repository.'
}

Write-Host 'Session check completed without modifying the repository.' -ForegroundColor Green
