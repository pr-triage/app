module.exports = {
  wip_regex: /^\s*(\[WIP\]\s*|WIP:\s*|WIP\s+)+\s*/i,
  label_unreviewed: {name: 'PR: unreviewed', color: 'fbca04'},
  label_approved: {name: 'PR: reviewed-approved', color: '0e8a16'},
  label_change_requested: {name: 'PR: reviewed-changes-requested', color: 'c2e0c6'}
}
