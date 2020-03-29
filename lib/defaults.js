module.exports = {
  wipRegex: /^\s*(\[WIP\]\s*|WIP:\s*|WIP\s+)+\s*/i,
  labelUnreviewed: {
    name: "PR: unreviewed",
    color: "fbca04",
  },
  labelApproved: {
    name: "PR: reviewed-approved",
    color: "0e8a16",
  },
  labelChangesRequested: {
    name: "PR: reviewed-changes-requested",
    color: "c2e0c6",
  },
  labelMerged: {
    name: "PR: merged",
    color: "6f42c1",
  },
  labelDraft: {
    name: "PR: draft",
    color: "6a737d",
  },
  labelPartiallyApproved: {
    name: "PR: partially-approved",
    color: "7E9C82",
  },
};
