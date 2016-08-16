# Git tips
## Overwrite pull
```sh
git fetch --all && git reset --hard origin/master
```

## List all the conflicted files
```sh
git diff --name-only --diff-filter=U
```

## See commit history for just the current branch
```sh
git cherry -v master
```

## What changed since two weeks?
```sh
git whatchanged --since='2 weeks ago'
```

## Modify previous commit without modifying the commit message
```sh
git add --all && git commit --amend --no-edit
```

## Open all conflicted files in editor
```sh
git diff --name-only | uniq | xargs $EDITOR
```

## List commits and changes to a specific file (even through renaming)
```sh
git log --follow -p -- <file_path>
```