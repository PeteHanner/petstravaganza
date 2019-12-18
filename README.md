# Petstravaganza

Flatiron Module 4 project by Peyton Doyle and Pete Hanner

Paired project focusing on JavaScript basics. In this game, users are tasked with taking care of several adorable animals at their pet daycare. Each of the six animals has four care options (eat, drink, exercise, and potty), which are populated in a task list for the player to keep up. Players earn points by successfully caring for their animals, but can lose points by letting tasks go undone for too long or by clicking the wrong task. 

We wrote our own random generation to populate the task list and pull animal species from our options on the backend. Names were randomized using the Ruby Faker gem. We used JavaScript timing events to push new tasks at regular intervals and keep track of time of day. A particular challenge was the "death spiral" that occurred for many users as soon as a single task expired. We handled this by writing another custom timing event to delay all task countdowns on an expiration event, allowing users to regain their bearings.

## Demo

