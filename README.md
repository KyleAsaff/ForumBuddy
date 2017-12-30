# Forum Buddy

### DESCRIPTION

A Google Chrome App that logs and creates a personalized newsfeed for whenever someone mentions your username on a forum and provides information and details about the post. Forum Buddy only supports http://forum.bodybuilding.com/ at the moment but will support all vBulletin forums and message boards in the future. 

### HOW IT WORKS

Scrapes the search database and recently visited threads of a forum and records all fourm posts that cointains your username in local storage. Forum Buddy uses background.js constantly scrape any specified message board to instantly find posts with your username mentioned and displays them in a personalized timeline. 


### PROJECT STATUS  

DONE:
- Scraping algorithm for querying the search database.
- Automatically scrapes on an interval
- Store all posts in Local Storage
- Parse "yesterday" and "today" to actual date
- Created basic UI for chrome app
- Fully functioning settings page
- Popup/popout page
- Pull username for the search query from the forum website
- Display a badge by donators usernames
- Disable x button during fade animation
- Improve scrape algorithm to get mention results almost instantaneously
- Sort results by date field in memory instead of top query search

TO DO:
- Update UI
- Write custom sort function for posts
- Display subscriptions in popup page
- Scrape and display latest reputation received data
- Hide posts from reds
- Make universal for all message boards
