const fs = require('fs');
const path = require('path');

const CHANGELOGS = {
  'js-sdk': 'js-sdk/changelog.md',
  ios: 'ios/changelog.md',
  android: 'android/changelog.md',
  'react-sdk': 'react-sdk/changelog.md',
  flutter: 'flutter/changelog.md',
  'react-native': 'react-native/changelog.md',
};

function extractLatestVersion(changelogPath) {
  if (!fs.existsSync(changelogPath)) {
    return null;
  }
  const content = fs.readFileSync(changelogPath, 'utf-8');
  const match = content.match(/^##\s+\[?v?(\d+\.\d+\.\d+)/m);
  return match ? match[1] : null;
}

module.exports = function latestVersionsPlugin(context) {
  return {
    name: 'latest-versions-plugin',
    async loadContent() {
      const versions = {};
      for (const [platform, relativePath] of Object.entries(CHANGELOGS)) {
        const changelogPath = path.join(context.siteDir, 'docs', 'sdk-guides', relativePath);
        versions[platform] = extractLatestVersion(changelogPath);
      }
      return versions;
    },
    async contentLoaded({content, actions}) {
      actions.setGlobalData(content);
    },
  };
};
