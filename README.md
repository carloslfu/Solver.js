# Solver.js (alpha version)

Solver.js is a library for solve common problems with a lot of complexity for humans, problems that could cause you a headache. Problems like to schedule tasks with many conditions will be resolved with one click.

This library uses genetic algorithms to solve the problems and this runs in a worker (or separated thread - when ported to node.js (TODO)). This code is an effort to rewrite a portion of code that i used in a business web app to be useful to the web community.

## TODOs

- Optimize core and avoid use object.js library (rewrite all core in vanilla js).
- Rewrite core for a simple API, and some missing features of the private proyect.
- Build system with Grunt.
- Make some examples and publish a task scheduler app (now private).
- Port to node.js.