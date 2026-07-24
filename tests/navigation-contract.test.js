const assert = require('assert');
const fs = require('fs');
const path = require('path');
const contract = require('../public/navigation-contract.js');

const examplesDir = path.join(
    __dirname, '..', 'contracts', 'career-navigation', 'examples'
);

for (const filename of [
    'ok.json',
    'data-insufficient.json',
    'service-failure.json'
]) {
    const payload = JSON.parse(
        fs.readFileSync(path.join(examplesDir, filename), 'utf8')
    );
    assert.strictEqual(contract.validateNavigationResponse(payload), payload);
}

const fakeSuccess = JSON.parse(
    fs.readFileSync(path.join(examplesDir, 'service-failure.json'), 'utf8')
);
fakeSuccess.data = {};
assert.throws(
    () => contract.validateNavigationResponse(fakeSuccess),
    /data must be null/
);

const unknownVersion = JSON.parse(
    fs.readFileSync(path.join(examplesDir, 'ok.json'), 'utf8')
);
unknownVersion.schema_version = '2.1.0';
assert.throws(
    () => contract.validateNavigationResponse(unknownVersion),
    /Unsupported schema version/
);

console.log('navigation contract consumer tests passed');
