# GitHub access for the team (8 Nov 2026)

- Repo: https://github.com/CarlosDelaCruzICC/mastertech-2026, private, owned by Carlos. Everyone commits to main (README).
- Status as of Sun 8 Nov 20:50: all three have write access; Simone and Justin accepted their invitations the same evening.

| Person | GitHub username | Invited | Accepted | Machine |
|---|---|---|---|---|
| Carlos | CarlosDelaCruzICC | owner | yes | Mac laptop |
| Simone | reanaraluker | yes, 8 Nov 19:58 | yes, 8 Nov | ? |
| Justin | cosmo-shi | yes, 8 Nov | yes, 8 Nov | ? |

## 1. What Simone and Justin send Carlos
- Their GitHub username, exactly as spelt on their profile page.
  o No account yet: free sign-up at https://github.com/signup, any email, then send the username.
  o A university or personal account both work; the repo stays private either way.
- Whether they will work on Windows or Mac, so the clone steps below fit.

## 2. What Carlos does (one terminal line, replace the two usernames)
- Adds both as collaborators with write access and lists the pending invitations:
export PATH="$HOME/bin:$PATH" && gh api -X PUT repos/CarlosDelaCruzICC/mastertech-2026/collaborators/SIMONE_USERNAME -f permission=push && gh api -X PUT repos/CarlosDelaCruzICC/mastertech-2026/collaborators/JUSTIN_USERNAME -f permission=push && gh api repos/CarlosDelaCruzICC/mastertech-2026/invitations --jq '.[] | "\(.invitee.login) invited \(.created_at)"'
- Fallback without usernames: repo page, Settings, Collaborators, Add people; that form also takes an email address.
- Invitations expire after 7 days; rerun the line to resend.

## 3. What Simone and Justin do after the invitation
- Accept the invitation email, or sign in and open https://github.com/CarlosDelaCruzICC/mastertech-2026/invitations.
- Get the files, pick one:
  o GitHub Desktop (simplest): install from https://desktop.github.com, sign in, File, Clone repository, choose mastertech-2026.
  o Command line, after installing git and signing in once:
git clone https://github.com/CarlosDelaCruzICC/mastertech-2026.git
- Clone into a plain local folder, never inside Google Drive, OneDrive or iCloud; sync tools corrupt the .git folder.
- Daily loop: pull before editing; commit small with a message saying what changed; push the same day.
- Push rejected: pull first, fix any marked conflict in the file, commit, push again. Stuck: tell Carlos.

## 4. Rules that travel with the repo (from README)
- Only fresh, original work; nothing from an employer, internship or other project.
- Audio and video never go in (transcripts only); the .gitignore blocks the common formats anyway.
- No personal data about students, ever; advisors' quotes stay approximate and marked.
- One file per topic, markdown; add a line to the README file index when adding a file.

## 5. Message for Carlos to send (copy, fill the two names)
Hi Simone, Justin. Our shared folder is now a private GitHub repo. To add you I need your GitHub username (make a free account at github.com/signup if you don't have one and send me the username). Once you accept the invitation email, the easiest way to get the files is GitHub Desktop: sign in, File, Clone repository, pick mastertech-2026. Clone into a normal folder, not inside Google Drive or OneDrive. Pull before you edit, commit small, push the same day. Notes for how we work are in README.md at the top of the repo.

## Sources

- https://github.com/CarlosDelaCruzICC/mastertech-2026, opened date not recorded.
- https://github.com/CarlosDelaCruzICC/mastertech-2026/invitations, opened date not recorded.
- https://github.com/CarlosDelaCruzICC/mastertech-2026.git, opened date not recorded.
- https://github.com/signup, opened date not recorded.
- https://desktop.github.com, opened date not recorded.
- README.md, the repo rules repeated in section 4, as cited in the body.
