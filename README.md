# Forum Buddy

### DESCRIPTION

A Google Chrome App that logs whenever someone mentions your username on a forum and provides information about the post. Right now, this app only works for http://forum.bodybuilding.com/ but will eventually support all vBulletin forums and message boards.

### HOW IT WORKS

Scrapes the search database and recently visited threads of a forum and records all fourm posts that cointains your username in Local Storage. Forum Buddy uses background.js constantly scrape any specified message board to instantly find posts with your username mentioned.


### PROJECT STATUS

DONE:
- Basic scraping algorithm for querying the search results database.
- Timer to scrape every minute
- Store all posts in Local Storage
- Parse "yesterday" and "today" to actual date
- Created basic UI for chrome app
- Settings page
- Popup/popout page
- Pull username for the search query from the forum website
- Display a badge by donators usernames
- Disable x button during animation
- Improve scrape algorithm to get mention results almost instantaneously
- Sort results by date field in memory instead of top query search

TO DO:
- Display subscriptions in popup page
- Scrape and display latest reputation received data
- Hide posts from reds
- Make universal for all vBulletin Forums and message boards
