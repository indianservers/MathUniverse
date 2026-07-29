# Offline Chart Usage

The app uses bundled npm chart libraries, not CDN links, so charts work offline after `npm install` and in production builds.

## Premier Probability/Statistics Charts

Use the D3-powered distribution chart from:

```tsx
import PremierDistributionChart from "../components/charts/PremierDistributionChart";
```

For probability-statistics module pages, the relative path is:

```tsx
import PremierDistributionChart from "../../../components/charts/PremierDistributionChart";
```

Example:

```tsx
<PremierDistributionChart
  points={result.points}
  kind={spec.kind}
  title={spec.name}
/>
```

`d3` is already listed in `package.json`, so Vite bundles it into `dist/assets` for offline use.
