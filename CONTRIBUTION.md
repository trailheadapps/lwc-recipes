## Contributing

1. Familiarize yourself with the codebase.
1. Create a new issue before starting your project so that we can keep track of
   what you are trying to add/fix. That way, we can also offer suggestions or
   let you know if there is already an effort in progress. We will let you know when you're good to go to start.
1. Fork this repository.
1. The [README](README.md) has details on how to set up your environment.
1. Create a _topic_ branch in your fork based on the correct branch (usually the **master** branch. Note, this step is recommended but technically not required if contributing using a fork.
1. Edit the code in your fork.
1. Sign CLA (see [CLA](#cla) below)
1. Send us a pull request when you are done. We'll review your code, suggest any
   needed changes, and merge it in.

### CLA

External contributors will be required to sign a Contributor's License
Agreement. You can do so by going to https://cla.salesforce.com/sign-cla.

## Branches

-   We work in `master`.
-   Our released (aka. _production_) branch is `master`.
-   Our work happens in _topic_ branches (feature and/or bug-fix).
    -   feature as well as bug-fix branches are based on `master`
    -   branches _should_ be kept up-to-date using `rebase`
    -   see below for further merge instructions

### Merging between branches

-   We try to limit merge commits as much as possible.

-   _Topic_ branches are:

    1. based on `master` and will be
    1. squash-merged into `master`.

## Pull Requests

-   Develop features and bug fixes in _topic_ branches.
-   _Topic_ branches can live in forks (external contributors) or within this repository (committers).
    \*\* When creating _topic_ branches in this repository please prefix with `<developer-name>/`.

### Merging Pull Requests

-   Pull request merging is restricted to squash & merge only.
