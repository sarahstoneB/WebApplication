# <h class="lt_logo"><span class="top-header">web-mdm-datasteward-vue </h>
<h class="vue_logo"><span class="sub-header">Datasteward in Vue</span></h>


### WEB-MDM-API - (Dependency)
This application requires the [web-mdm-api](https://github.com/LiaisonTechnologies/web-mdm-api) to function properly.
1. Fork the [web-mdm-api](https://github.com/LiaisonTechnologies/web-mdm-api#fork-destination-box) to your Github account.
2. Clone your new Fork'd branch of the Liaison eg ( L/master )
3. <h class='inline_blue'>`git remote -v`</h> will let you see your remotes for the Repository. You should see `origin` for your fork. This can be renamed if you desire.
4. Once cloned, add the Liaison remote to git. <h class='inline_blue'>`git remote add L git@github.com:LiaisonTechnologies/web-mdm-api.git`</h>
5. You can use the same <h class='inline_blue'>`git remote add`</h> command to add other remotes by name eg (<h class='inline_blue'>`git remote add otherUser
git@github.com:otherUser/web-mdm-api.git`</h>)

### Getting Things Going!
1. <span class='inline_red'>`npm install`</span> or <span class='inline_red'>`npm update`</span> to pull down the latest packages.
2. <span class='inline_red'>`npm run build`</span> - initially bundles everything and creates the `/dist` folder.
3. <span class='inline_red'>`npm run dev`</span> - Development Mode.

### Setting up environment
* Manually create an `.env` file in the project folder and grab the below `.env` format shown below.
>This is not the full set, many of them were removed for convenience (related to logging, monitoring, SSO, etc.)
These are the currently used environment variables, the minimum set as of 14.12.2016.
They are subject to change and have many more later on, stay updated from gitlab.
----

```
# Basic Server & API Urls
# ---------------------------------------------------------------------------
#   "http://at4u-lvmdmapi01.liaison.prod:8991/api" || DEV: "http://localhost:8090/api",
#   "http://at4u-lvmdmapi01.liasion.prod:8991/util" || DEV: "http://localhost:8090/utils"
WEB_MDM_API_URL=http://at4u-lvmdmapi01.liaison.prod:8991/api
WEB_MDM_UTIL_URL=http://at4u-lvmdmapi01.liasion.prod:8991/util


# Hapi settings
# ---------------------------------------------------------------------------
PORT=8091


# Cookie & Token Settings
# ---------------------------------------------------------------------------
COOKIE_SECURE=false
COOKIE_HTTPONLY=false
TOKEN_SECRET=somethingVerySecret


# Application Specific - Global Features
# ---------------------------------------------------------------------------
# US / EU / SIT Instances Environment Configurations
# ---------------------------------------------------------------------------
ENV_INSTANCE=us
CUSTOMER=Merz
# LOGO=https://www.newyorklife.com/content/nyl-cms-dotcom/en/_jcr_content/parHead/navigation/image.img.jpg/1473965590055.jpg
LOGO=http://www.rosascale.com/media/layout_1/img/base_logo-print.gif



# Application Modules 
# ---------------------------------------------------------------------------

# --- Dashboard
DASHBOARD_APP=true

# --- Dataview
# - ex. UAT=1522579, SIT=1611073
# - ex. `recordview` or `cardview` for default view to show.
DATAVIEW_APP=true
DEF_DATAVIEW_ID=1522579
DEF_DATAVIEW=recordview

# --- Match & Merge | UAT=1522832, SIT=1544732
MATCH_MERGE_APP=true
DEF_MATCHMERGE_ID=1522832

# --- Error Remediation | UAT=1521826, SIT=1544694
ERROR_REMEDIATION_APP=true
DEF_ERRORREM_ID=1521826

# --- MISC. Other module settings
DATA_PROFILER=false
EDIT=false
```

<!-- STYLING FOR README -->
<!--<style>
  .inline_red {
    color: red
  }
  .inline_blue {
    color: darkblue
  }
  .lt_logo {
    background: url(https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAfAAAAAJGE4NzJjZTJkLTY4OTMtNGUxMi1hN2I1LTMwNzYyOWE1OWVjNA.png);
    background-size: 40px;
    background-repeat: no-repeat;
  }
  .vue_logo {
    background: url(https://avatars3.githubusercontent.com/u/6128107?v=3&s=400);
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: left;
    margin-left: 20px;
  }
  .top-header {
  padding-left:50px;
}
  .sub-header {
    font-size: 20px;
    color: darkgreen;
    padding-left: 28px;
  }
</style>-->
