module.exports = {
    "verbose": true,
    "testURL": "http://localhost/",
    "collectCoverageFrom": [
        "lib/**/*.js"
    ],
    "collectCoverage": true,
    "coverageDirectory": "./coverage/",
    "coverageThreshold": {
        "global": {
            "functions": 80,
            "lines": 80
        }
    },
    "testPathIgnorePatterns": [
        "node_modules",
        "test/fixtures",
        "test/simulates"
    ],
    "watchPathIgnorePatterns": [
        "node_modules",
        "test/fixtures",
        "test/simulates"
    ]
}
