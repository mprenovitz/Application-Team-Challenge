# Internship Coding Challenge, Application Team
## Background

The Application team is responsible for the full-stack development of Intus Care's core product offerings. This team is tasked with building and maintaining user interfaces, developing robust APIs, integrating with databases, managing server-side logic, and more. Developers on the Application team are, as a result, interdisciplinary by nature and work across a variety of tasks, encompassing both frontend and backend development.

As an intern, you will be integrated into the Application team as a full-fledged developer, no different from any other engineer on the team. You will be engaged in the team's sprints following the Agile framework, carry a balance of work similar to other developers, and participate in refinement and technical planning meetings, among other responsibilities.

The Application team's current focus is on developing CareHub, a flagship workflow tool for PACE programs. The tech stack used consists of `TypeScript`, `React`, `Next.js`, `Material-UI`, and `MongoDB`. Familiarity with `tRPC` APIs, `Zod`, `Zustand`, and `Playwright` may be helpful as well.

## Challenge Specification: Basic Participant List Feature
### User Story:

Your client wants to be able to keep track of the participant (ppt) information for their organization. The first feature is a list of participants with the corresponding ICD codes for each ppt. The client would like to see a list of all participants in their organization and sort them based on how many codes each ppt has. They also need to see each partipant's codes (in both ICD-code format and plain English) in a focus view, similar to a modal, for each person. In consultation with Intus Care designers, they have also finalized a Figma kit for the approximate design of this feature, included in the `Resources` section, although they are not firm on you implementing the exact design - it is up to your discretion.

### Instructions:

Implement the User Story to the best of your ability in a fork of this repository. 

It is your responsibility to bootstrap the repository as you see fit (with a programming language of your choice). If you plan on utilizing a framework and/or component library, we respectively recommend `Next.js` and `Material-UI` since they are what the Application team uses, but this is ultimately up to your discretion and comfort.

Make sure to familiarize yourself with the `Resources` section and read the `Notes` section in detail.


### Resources:

The few existing resources you are provided with in the repository include:

- A simple Express API which provides a ```GET /participants``` route for fetching ppt information (including participant names and their ICD codes). To start the API server, run ```node ./api/index.js``` from the repository's root directory.
- Icons and logo assets to use (formatting choices are up to you, as is your usage of these assets). 

Additional important resources:
- Use the Clinial Table Search Service provided by the National Library of Medicine (linked [here](https://clinicaltables.nlm.nih.gov/apidoc/icd10cm/v3/doc.html)) to retrieve the plain English names for the associated ICD codes.
- Use the Figma kit (linked [here]( https://www.figma.com/file/5xvyEkogl7FVbl5hbiJptO/PptListFeature?node-id=0%3A1
)) for a hi-fi prototype of ideal behavior and styling for the app. You can also press play in the upper right corner to click through the prototype's behavior.
We have provided the styling specifications (hexcode, drop shadow, border radius, etc.) for you in hopes of making the styling portion easier, as we are trying to test functionality, reusability, and responsiveness more than styling perfection. 


### Notes:

#### Base Features
- Participant list view with ICD code count.
- Participant focus view with ICD code and condition name list.

#### Extra Features
- Sorting filter for Ppt list view: default to sorting highest to lowest, can be toggled to sort from lowest to highest.
- Bonus points: make the sorting filter extensible to sort by Partipant name (alphabetical).

#### Areas to Focus on 
- Extensibility of the ppt list component,
- Routing and saving history of navigation between list and focus view, with the possibility of added pages to the app in the future, and
- Any other element(s) you feel may benefit from further improvement. This challenge is meant to be open-ended, so please do not feel constrained by the specifications. Feel free to be creative!



### Submission

Fork this repository and reply to the challenge email with a link to your fork when you have completed it.

Good luck!


### Implementation README
Hello, to run the code locally, start up the server as stated in the instructions file, node ./api/index, and for the front end do cd client --> npm start, and navigate to http://localhost:3000/, or got to Vercel link: https://application-team-challenge-eight.vercel.app/ (front-end only). Unable to deploy to backend due to use of node-persist, which is file-based and conflicts with Vercel serverless fuctionality.
For specific funcitonallity of functions and React elements see inline comments, however generally you can click on participant names to seea focused view of the patients, search for specific patients names in the search bar (or any matches containing search value if providing just first or last, or part of a name), sort alphabetically (A-Z and Z-A), by count (ascending and descending), and the default unsorted view. If you want to return the the home page, you can click the intus icon in the navbar to do so (for this challenge it will return you to the list view). Alphabetical sorting is done by first name, since aprticpants names are displayed FirstName LastName. I utilized node-persist for the cache and materials-ui for front end styling, with typescript for front end files and javascript for backend files.

