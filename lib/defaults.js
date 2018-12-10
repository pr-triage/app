module.exports = {
  wipRegex: /^\s*(\[WIP\]\s*|WIP:\s*|WIP\s+)+\s*/i,
  labelUnreviewed: {
    name: "Status: Review Needed :passport_control:",
    color: "FFFFFF"
  },
  labelInReview: {
    name: "Status: In Review :detective:",
    color: "00FFFF"
  },
  labelApproved: {
    name: "Status: Accepted :heavy_check_mark:",
    color: "00FF00"
  },
  labelChangesRequested: {
    name: "Status: Changes requested",
    color: "c2e0c6"
  },
  labelMerged: {
    name: "Status: Merged",
    color: "6f42c1"
  }
};
