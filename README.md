<p align="center">
  <img src="logo.png" width="500px">
</p>

Networking for the diplomatiq world.

[https://app.diplomatiq.org](https://app.diplomatiq.org)

<p>
<a href="https://github.com/Diplomatiq/diplomatiq-frontend/actions?query=workflow%3A%22Build%2C+test+and+publish+to+Azure+%28develop%29%22" target="_blank" style="text-decoration: none;">
  <img src="https://github.com/Diplomatiq/diplomatiq-frontend/workflows/Build,%20test%20and%20publish%20to%20Azure%20(develop)/badge.svg" alt="build status">
</a>

<a href="https://github.com/Diplomatiq/diplomatiq-frontend/actions?query=workflow%3A%22Build%2C+test+and+publish+to+Azure+%28production%29%22" target="_blank" style="text-decoration: none;">
  <img src="https://github.com/Diplomatiq/diplomatiq-frontend/workflows/Build,%20test%20and%20publish%20to%20Azure%20(production)/badge.svg" alt="build status">
</a>

<a href="https://github.com/Diplomatiq/diplomatiq-frontend" target="_blank" style="text-decoration: none;">
  <img src="https://img.shields.io/github/languages/top/Diplomatiq/diplomatiq-frontend.svg" alt="languages used">
</a>
</p>

<p>
<a href="https://sonarcloud.io/dashboard?id=Diplomatiq_diplomatiq-frontend" target="_blank" style="text-decoration: none;">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=Diplomatiq_diplomatiq-frontend&metric=alert_status" alt="Quality Gate">
</a>

<a href="https://sonarcloud.io/dashboard?id=Diplomatiq_diplomatiq-frontend" target="_blank" style="text-decoration: none;">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=Diplomatiq_diplomatiq-frontend&metric=sqale_rating" alt="Maintainability Rating">
</a>

<a href="https://sonarcloud.io/dashboard?id=Diplomatiq_diplomatiq-frontend" target="_blank" style="text-decoration: none;">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=Diplomatiq_diplomatiq-frontend&metric=reliability_rating" alt="Reliability Rating">
</a>

<a href="https://sonarcloud.io/dashboard?id=Diplomatiq_diplomatiq-frontend" target="_blank" style="text-decoration: none;">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=Diplomatiq_diplomatiq-frontend&metric=security_rating" alt="Security Rating">
</a>

<a href="https://github.com/Diplomatiq/diplomatiq-frontend/pulls" target="_blank" style="text-decoration: none;">
  <img src="https://api.dependabot.com/badges/status?host=github&repo=Diplomatiq/diplomatiq-frontend" alt="Dependabot">
</a>
</p>

<p>
<a href="https://gitter.im/Diplomatiq/diplomatiq-frontend" target="_blank" style="text-decoration: none;">
  <img src="https://badges.gitter.im/Diplomatiq/diplomatiq-frontend.svg" alt="Gitter">
</a>
</p>

---

## Basics

The application is implemented with the Angular framework.

After something is pushed to the `develop` branch, the branch is immediately deployed to the `develop` slot of the `diplomatiq-frontend` resource in Azure: [https://app.diplomatiq.org/?x-ms-routing-name=develop](https://app.diplomatiq.org/?x-ms-routing-name=develop)

Same for the `master` branch, but after a push, the branch is deployed to the `staging` slot, which gets auto-swapped into production in order to reach the zen of zero-downtime deployment.

## Development

See [CONTRIBUTING.md](https://github.com/Diplomatiq/diplomatiq-frontend/blob/develop/CONTRIBUTING.md) for details.

---

Copyright (c) 2018 Diplomatiq
