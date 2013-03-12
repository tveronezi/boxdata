boxdata
=======

### Quick start ###

If you use a Unix-like OS with Makefile support, you can run the application by following these simple steps.

1. Checkout this source code
2. Go to the root of your application and run *make clean-start*
3. Open <http://localhost:8080/boxdata>


### Makefile targets ###

* make up-static #It updates the "webapp/app" directory and the index.html/jsp file
* make up-war #It kills TomEE, rebuilds the application and installs the new application war file
* make up-war-restart #It calls "make up-war" followed by "make restart-tomee"
* make clean-install #Just an alias to mvn clean install -DskipTests=true
* make unzip-tomee #It unzips the latest TomEE installed in your mvn repository
* make start-tomee
* make kill-tomee #It calls kill -9 <TomEE process id>
* make clean-start #The same as "make clean-install" followed by "make start-tomee"
* make restart-tomee #It starts TomEE without a new build of your application
* make tail #It tails the catalina.out file
* make run-jasmine
* make run-lint
