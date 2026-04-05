### Considerations and reflections
- [x] What considerations regarding security and user privacy did you have when designing the system?

Authentication relies on short-lived JWTs with refresh tokens stored in HttpOnly cookies.

Image uploads use pre-signed S3 URLs — binary data never passes through application servers — and EXIF metadata (including GPS coordinates) is stripped before storage. All client traffic routes through an API Gateway, keeping microservices off the public network.


- [x] How would the system scale with increased workloads and do you have any bottlenecks?

The React frontend scales passively via CDN — no server to manage. Microservices scale independently based on load. The primary bottlenecks are: geolocation search (mitigated by PostGIS spatial indexes or Elasticsearch geo_distance queries, plus aggressive caching of common area queries), image delivery (CloudFront in front of S3 with on-the-fly resizing for mobile), and the social feed (cursor-based pagination over offset-based to avoid full table scans as content grows). A Redis caching layer sits in front of hot DB reads; TanStack Query handles stale-while-revalidate semantics on the client side.


**Constraints for the solution:**
- [x] Solution must be written as a React application
- [x] The solution architecture must be designed to run on a cloud hosting-based platform, such as Amazon Web Services or Microsoft Azure
- [x] Presentation must take no more than 15-20 minutes

**Delivery expectations:**
- [x] We would like to see your thoughts and plans documented as Context and Container diagrams as described in the [C4 model](https://c4model.com/)
- [x] All files and code must be uploaded to your public GitHub repository (or similar)
- [x] Oral presentation of the solution, including an explanation about architecture decisions, reflections and possible limitations of the solution
