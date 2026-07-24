(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    root.CareerNavigationContract = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const STATUSES = new Set(['ok', 'data_insufficient', 'service_failure']);
    const PATH_TYPES = new Set(['deepen', 'adjacent', 'explore']);

    function requireObject(value, name) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            throw new Error(`${name} must be an object`);
        }
    }

    function requireArray(value, name) {
        if (!Array.isArray(value)) throw new Error(`${name} must be an array`);
    }

    function validateNavigationResponse(response) {
        requireObject(response, 'response');
        if (response.schema_version !== '2.0.0') {
            throw new Error(`Unsupported schema version: ${response.schema_version}`);
        }
        if (!STATUSES.has(response.status)) {
            throw new Error(`Unknown response status: ${response.status}`);
        }
        if (typeof response.request_id !== 'string' || !response.request_id) {
            throw new Error('request_id is required');
        }
        if (response.status === 'service_failure') {
            if (response.data !== null) throw new Error('service_failure data must be null');
            requireObject(response.error, 'error');
            return response;
        }
        if (response.error !== null) throw new Error('non-failure response cannot contain error');
        requireObject(response.data, 'data');
        requireArray(response.data.paths, 'data.paths');
        requireArray(response.data.evidence, 'data.evidence');
        requireArray(response.data.sources, 'data.sources');
        requireArray(response.data.coverage_gaps, 'data.coverage_gaps');
        if (
            response.status === 'data_insufficient'
            && response.data.coverage_gaps.length === 0
        ) {
            throw new Error('data_insufficient requires coverage gaps');
        }
        for (const path of response.data.paths) {
            requireObject(path, 'path');
            if (!PATH_TYPES.has(path.path_type)) {
                throw new Error(`Unknown path type: ${path.path_type}`);
            }
            requireObject(path.target_occupation, 'path.target_occupation');
            requireObject(path.uncertainty, 'path.uncertainty');
            requireArray(path.evidence_ids, 'path.evidence_ids');
            requireArray(path.source_ids, 'path.source_ids');
        }
        return response;
    }

    function statusLabel(status) {
        return {
            ok: '证据就绪',
            data_insufficient: '数据不足',
            service_failure: '服务失败'
        }[status] || '未知状态';
    }

    function pathTypeLabel(pathType) {
        return {
            deepen: '本行业深化',
            adjacent: '邻近迁移',
            explore: '跨行业探索'
        }[pathType] || '未知路径';
    }

    return {
        validateNavigationResponse,
        statusLabel,
        pathTypeLabel
    };
}));
