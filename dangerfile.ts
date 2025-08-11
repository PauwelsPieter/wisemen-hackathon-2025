import { danger, message, warn } from 'danger'

// Check if CHANGELOG.md was modified in the PR
const changelogModified = danger.git.modified_files.includes('CHANGELOG.md')

if (!changelogModified) {
  warn('Please add a relevant entry to CHANGELOG.md for this PR.')
} else {
  message('🎉 Changelog updated! Great job!')
}

message('Thank you for extending the project! 🚀')
