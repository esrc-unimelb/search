# eSRC Search app

## Hacking on the app

  * install livereload into chrome
  * grunt serve (in the top level directory)
  * http://dev01:9000
  * work on the master branch

## Building an instance
  * From any branch
   * grunt build
   * grunt buildcontrol:testing

## Building out an instance
  * branch the code
  * make your site specific customisation
  * grunt build
  * grunt buildcontrol:testing
  * git clone -b testing {this repo} . (where you want to deploy that testing version)