import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.scss';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';

type LatestVersions = Record<string, string | null>;

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  path: string;
  versionKey: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'JS',
    Svg: require('@site/static/img/js.svg').default,
    path: 'js-sdk/how-to-get-started',
    versionKey: 'js-sdk',
  },
  {
    title: 'React',
    Svg: require('@site/static/img/react.svg').default,
    path: 'react-sdk/how-to-get-started',
    versionKey: 'react-sdk',
  },
  {
    title: 'Android',
    Svg: require('@site/static/img/android.svg').default,
    path: 'android/how-to-get-started',
    versionKey: 'android',
  },
  {
    title: 'iOS',
    Svg: require('@site/static/img/ios.svg').default,
    path: 'ios/how-to-get-started',
    versionKey: 'ios',
  },
  {
    title: 'React Native',
    Svg: require('@site/static/img/react.svg').default,
    path: 'react-native/how-to-get-started',
    versionKey: 'react-native',
  },
  {
    title: 'Flutter',
    Svg: require('@site/static/img/flutter.svg').default,
    path: 'flutter/how-to-get-started',
    versionKey: 'flutter',
  },
];

function Feature({ title, Svg, path, versionKey }: FeatureItem) {
  const versions = usePluginData('latest-versions-plugin') as LatestVersions;
  const version = versions[versionKey];
  return (
    <div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3" className={styles.sdkPlatform}>
          {title}
        </Heading>
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
        <Link to={`/sdk-guides/${path}`} className={styles.sdkButton}>
          Get started
        </Link>
      </div>
      {version && <span className={styles.featureVersion}> v{version}</span>}
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresList}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
