//!groovy





@Library('visibilityLibs')
import com.liaison.jenkins.visibility.Utilities;
import com.liaison.jenkins.common.sonarqube.SonarScanner;

def utils = new Utilities();

// node('ci/slave/nodejs') {

try {
  node('agent-nodejs') {

    stage('Check out from SCM') {
      // Git checkout should be fast - fail after 2 minutes as that means Git isn't working properly
      timeout(2) {
        // check out repository
        checkout scm;
        env.GIT_COMMIT = utils.runSh('git rev-parse HEAD')

        // saving the repo's contents to the stash
        stash name: "fullRepo", includes: "**" // all files and folders
        stash name: "npmBasics", includes: "*" // all files in the root folder + the bin folder with all its contents
        // stash name: "tests", includes: "test/" // the tests folder with its contents
        stash name: "code", includes: "dist/,routes/, public/, config/"
        stash name: "k8s", includes: "K8sfile.yml"
      }
    }

    stage('NPM Install | Create build info JSON | Run NSP check') {
      timeout(10) {
        // retrieving application information from the package.json
        env.PACKAGE_NAME = utils.runSh('node -e "console.log(require(\'./package.json\').name);"')
        env.PACKAGE_VERSION = utils.runSh('node -e "console.log(require(\'./package.json\').version);"')
        env.CURRENT_DATE_TIME = utils.runSh('node -e "console.log(new Date().toISOString().replace([-:]/g, \'\').replace(/T/g, \'-\').substring(0, 15));"')
        env.BUILD_VERSION_FILENAME = "build_version.json"

        // printing build information for validating
        echo "package name: ${env.PACKAGE_NAME}"
        echo "package json version: ${env.PACKAGE_VERSION}"
        echo "current date time: ${env.CURRENT_DATE_TIME}"
        echo "git branch: ${env.GIT_BRANCH}"
        echo "git commit: ${env.GIT_COMMIT}"
        echo "pull request id: ${env.BRANCH_NAME}"
        echo "build number: ${env.BUILD_NUMBER}"
        echo "build version file: ${env.BUILD_VERSION_FILENAME}"
        echo "no cache docker build option enabled: ${env.NO_CACHE}"
        echo "forcing push of build artifact enabled: ${env.FORCE_PUSH}"

        // create the build version info json
        def sb = "";
        sb = sb + "{                                                     \n";
        sb = sb + "  \"packageName\": \"${env.PACKAGE_NAME}\",           \n";
        sb = sb + "  \"packageJsonVersion\": \"${env.PACKAGE_VERSION}\", \n";
        sb = sb + "  \"buildDateTime\": \"${env.CURRENT_DATE_TIME}\",    \n";
        sb = sb + "  \"gitCommit\": \"${env.GIT_COMMIT}\",               \n";
        sb = sb + "  \"pullRequestId\": \"${env.BRANCH_NAME}\",          \n";
        sb = sb + "  \"buildNumber\": \"${env.BUILD_NUMBER}\"            \n";
        sb = sb + "}                                                       ";
        def buildVersionStr = sb;

        // write the build info into a json file (this is reused within the application docker container!)
        utils.writeToFile(env.BUILD_VERSION_FILENAME, buildVersionStr);
        sh 'cat '+env.BUILD_VERSION_FILENAME

        // handling the results
        stash name: "buildInfo", includes: env.BUILD_VERSION_FILENAME
        echo "successfully created the build version JSON file!"

        sh 'node -v'
        sh 'npm -v'

        // == NPM Install ==

        // testing yarn install
        // utils.npmInstall("yarn");
        // sh "./node_modules/.bin/yarn || echo 'yarn failed'";

        // As a workaround for PhantomJS issue we'll install it before other node_modules
        // https://github.com/Medium/phantomjs/issues/659
        // utils.npmInstall("phantomjs-prebuilt@2.1.14");

        // install the dependencies
        utils.npmInstall("");

        // quick fix for a faulty package...
        // sh 'rm -rf dist/public/node_modules/dgeni/docs'

        // run test
        sh 'npm test'

        // handling the results
        stash name: "nodeModules", includes: "node_modules/,dist/"
        echo "successfully installed npm dependencies!"

        // == Security checks ==

        // run the security check
        utils.nspCheck(["package.json"]);
        env.NSP_RESULT = utils.runSh("./node_modules/.bin/nsp check");
        echo "NSP result: ${env.NSP_RESULT}"

        // handling the results
        echo "The security checks were successful!"

        // export release notes from CHANGELOG.md
        utils.npmInstall("node-changelog-parser-cli");
        env.RELEASE_NOTES = utils.runSh("node ./node_modules/node-changelog-parser-cli/index.js -r ${env.PACKAGGE_VERSION} ./CHANGELOG.md -n");
        echo "Release notes: ${env.RELEASE_NOTES}"
      }
    }

    stage('Code analysis') {
        // timeout after 10 minutes
      timeout(10) {

        def sonar = new SonarScanner();

        if (utils.isPRBuild()) {
          // Run preview analysis only for PRs.
          def pullRequestNumber = utils.runSh("echo ${env.BRANCH_NAME} | cut -d- -f 2")
          sonar.runPreviewModeAnalysis('SonarQube Scanner', "${env.PACKAGE_VERSION}", "${pullRequestNumber}", 'sonar-github-token', './sonar-project.properties');
        } else {
          // Run full analysis for merged changes.
          sonar.runFullModeAnalysis('SonarQube Scanner', "${env.PACKAGE_VERSION}", './sonar-project.properties');
        }
      }
    }

    stage('NPM build dist') {
      timeout(5) {
        // build the project
        sh 'NO_ENV_DOWNLOAD=true npm run build'

        // handling the results
        stash name: "dist", includes: "dist/"
        echo "The build was successful!"
      }
    }
  } // Release agent-nodejs

  node('agent-nodejs') {
    // setting up docker image & container names
    def dockerImageName = "visibility/${env.PACKAGE_NAME}";

    stage('Build docker image') {
      timeout(25) {
        // getting context
        utils.unstashMany(["npmBasics", "nodeModules", "dist", "buildInfo", "code"])
        // run the build
        utils.dockerBuild(dockerImageName)
      }
    }

    stage('Push the image to Docker registry') {
      timeout(15) {
        if (utils.isPRBuild()) {
          echo "This was a pull request, not puching the image!"
        } else {
          // Note: here we must already have the docker image built, within the local docker service registry
          echo "Pushing the image to registry..."
          utils.dockerPush(dockerImageName, env.PACKAGE_VERSION)
          utils.dockerPush(dockerImageName, "latest")

          echo "Creating github release notes..."
          def releaseNotes = "Image: `docker.ci.liaison.com/${dockerImageName}:${env.PACKAGE_VERSION}`\n\n${env.RELEASE_NOTES}"
          utils.createGithubReleaseMultiLineReleaseNotes(env.PACKAGE_NAME, env.GIT_COMMIT, env.PACKAGE_VERSION, releaseNotes)
        }
      }
    }
  } // Release agent-nodejs

  try {
    if (!utils.isPRBuild()) {
      stage('Deploy to DEV-INT Kubernetes') {
        // Deploy to Kubernetes
        node() {
          unstash 'k8s'
          withCluster(credentialId: 'at4d-c1', namespace: 'dev') {
            def dockerImagePrimaryName = "visibility/${env.PACKAGE_NAME}:${env.PACKAGE_VERSION}"
            utils.deployToKubernetes('k8sfile.yml', dockerImagePrimaryName, 'dev')
          }
        }
      }
    }
  } catch(err) {
    echo "Error while deploying to Kubernetes: ${err}"
  }

  currentBuild.result = "SUCCESS";
}
catch (err) {

  withCredentials([string(credentialsId: 'slack-apps-ci', variable: 'TOKEN')]) {
    def lastLogLines = currentBuild.rawBuild.getLog(10)
    slackSend channel: '#apps-ci', color: 'danger', message: "${env.PACKAGE_NAME} build #${env.BUILD_NUMBER} failed. (<${env.BUILD_URL}console|Open>)\nError: ${err}\nLast 10 lines from log: ```${lastLogLines}```", teamDomain: 'liaison', token: env.TOKEN
  }

  currentBuild.result = "FAILURE";
  throw err;
}

if (!utils.isPRBuild()) {
  stage('Approve release, promote to QA-STAGE') {

    withCredentials([string(creditialsId: 'slack-apps-ci', variable: 'TOKEN')]) {
      def msg = "@here: Approve promotion of *${env.PACKAGE_NAME} v${env.PACKAGE_VERSION}* (build #${env.BUILD_NUMBER}) to QA-STAGE? (<${env.JOB_URL}>\n"
      msg = msg + "- SonarQube analysis: <https://at4ch.liaison.dev/sonarqube/dashboard/index/${env.PACKAGE_NAME}|${env.PACKAGE_NAME}>\n"
      msg = msg + "- <${env.UT_REPORT_URL}|Unit Test Results>\n"
      msg = msg + "- <${env.E2E_REPORT_URL}| E2E Test Results>\n"
      msg = msg + "- Vulnerability scan: _${env.NSP_RESULT}_\n"
      msg = msg + "- Release notes for v${env.PACKAGE_VERSION}:\n"
      msg = msg + "```${env.RELEASE_NOTES}```"

      slackSend channel: '#apps-ci', color: 'good', message: msg, teamDomain: 'liaison', token: env.TOKEN
    }
    milestone()
    env.PROMOTED_TO_QA = userApproveNotify 24, 'HOURS', "Promote this build to QA-STAGE?", "slack-apps-ci", "#apps-ci"
    milestone()
  }
}

if (!utils.isPRBuild() && "${env.PROMOTED_TO_QA}" == "true") {
  stage('Accept to QA_STAGE') {

    withCredentials([string(credentialsId: 'slack-apps-qa-approval', variable: 'TOKEN')]) {

      def msg = "@here: Accept *${env.PACKAGE_NAME} v${env.PACKAGE_VERSION}* (build #${env.BUILD_NUMBER}) to QA_STAGE? (<${env.JOB_URL}|Open>)\n"
      msg = msg + "- <https://at4ch.liaison.dev/sonarqube/dashboard/index/${env.PACKAGE_NAME}|SonarQube analysis>\n"
      msg = msg + "- <${env.UT_REPORT_URL}|Unit Test Results>\n"
      msg = msg + "- <${env.E2E_REPORT_URL}|E2E Test Results>\n"
      msg = msg + "- Vulnerability scan: _${env.NSP_RESULT}_\n"
      msg = msg + "- Release notes for v${env.PACKAGE_VERSION}:\n"
      msg = msg + "```${env.RELEASE_NOTES}```"

      slackSend channel: '#apps-qa-approval', color: 'good', message: msg, teamDomain: 'liaison', token: env.TOKEN
    }

    milestone()
    env.ACCEPTED_TO_QA = userApproveNotify 24, 'HOURS', "Accept this build to QA-STAGE?", "slack-apps-qa-approval", "#apps-qa-approval"
    milestone()
  }

  if ("${env.ACCEPTED_TO_QA}" == "true") {
    try {
      stage('Deploy to QA-STAGE') {
        // 10 min timeout
        timeout(10) {
          //Deploy to Kubernetes
          node() {
            unstash 'k8s'
            withCluster(credentialId: 'at4d-c1', namespace: 'qa') {
              def dockerImagePrimaryName = "visibility/${env.PACKAGE_NAME}:${env.PACKAGE_VERSION}"
              utils.deployToKubernetes('K8sfile.yml', dockerImagePrimaryName, 'qa')
            }
          }

          withCredentials([string(credentialsId: 'slack-apps-qa-approval', variable: 'TOKEN')]) {
            slackSend channel: '#apps-qa-approval', color: 'good', message: "${env.PACKAGE_NAME} build #${env.BUILD_NUMBER} was promoted to QA-STAGE.", teamDomain: 'liaison', token: env.TOKEN
          }
        }
      }
      node {
        stage('Verify QA-STAGE deployment') {
          // 2 min timeout
          timeout(2) {
            testSite 3, 200, "https://at4qw/liaison.dev/dsui/health?verbose=true" // need where this thing will live to test
          }
        }
      }
    } catch (err) {
      withCredentials([string(credentialsId: 'slack-apps-qa-approval', variable: 'TOKEN')]) {
        slackSend channel: '#apps-qa-approval', color: 'danger', message: "Deployment of ${env.PACKAGE_NAME} build #${env.BUILD_NUMBER} into QA-STAGE failed. (<${env.BUILD_URL}console|Open>)", teamDomain: 'liaison', token: env.TOKEN
      }
      currentBuild.result = "FAILURE";
      throw err;
    }
  }
}

//     node('ci/slave/dind') {

//       // setting up docker image&container names
//       def dockerImageName = "visibility/${env.PACKAGE_NAME}";
//       def dockerTestImageName = "visibility/${env.PACKAGE_NAME}-tests";
//       def dockerTestContainerName = "${env.PACKAGE_NAME}-tests";

//       stage('Build PROD docker image') {

//         // getting context
//         utils.unstashMany(["npmBasics", "nodeModules", "dist"])

//         // run the build
//         sh "docker build -f Dockerfile -t ${dockerImageName} ."
//       }

//       stage('Build TEST docker image') {

//         // getting tests context
//         utils.unstashMany(["tests"])

//         // creating and building the tests docker image
//         sh "echo 'FROM ${dockerImageName}' | cat - Dockerfile_test > temp && mv temp Dockerfile_test"
//         sh "docker build -f Dockerfile_test -t ${dockerTestImageName} .";

//         // killing and removing the tests container and image if they existed before
//         sh "docker kill ${dockerTestContainerName} || echo 'container is already killed'"
//         sh "docker rm --force ${dockerTestContainerName} || echo 'container is already removed'"
//       }

//       stage('Running the tests') {

//         // running the tests image
//         sh "docker run --name ${dockerTestContainerName} ${dockerTestImageName}"

//         // saving the test results from the container
//         sh "docker cp ${dockerTestContainerName}:/home/node/app/testresults ."
//         stash name: "testResults", includes: "testresults/"

//         // NOTE: saving the test results to a VM should come here

//         // killing and removing the tests container and image afterwards
//         sh "docker kill ${dockerTestContainerName} || echo 'container is already killed'"
//         sh "docker rm --force ${dockerTestContainerName} || echo 'container is already removed'"
//         sh "docker rmi --force ${dockerTestImageName} || echo 'image is already removed'"
//       }

//       stage('Push the PROD image to Docker registry') {
//         if (utils.isPRBuild()) {
//           echo "This was a pull request, not pushing the image!"
//         }
//         else {
//           // Note: here we must already have the docker image built, within the local docker service registry
//           echo "Pushing the prod image to registry..."
//           utils.dockerPush(dockerImageName, env.PACKAGE_VERSION)
//           utils.dockerPush(dockerImageName, "latest")

//           stage ('Deploy to LAB') {
//             if (!utils.autoDeploy(env.PACKAGE_NAME)) {
//               echo "Couldn't auto-deploy project in LAB";
//               currentBuild.result = "UNSTABLE";
//             }
//           }
//         }
//       }
//     }

//     currentBuild.result = "SUCCESS";
//   }
//   catch (err) {
//     currentBuild.result = "FAILURE";
//     throw err;
//   }
// // }
