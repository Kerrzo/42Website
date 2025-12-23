var stepView = true;
var activeMatrialDataId = "";
var firstInit = true;
const modelViewerVariants = document.querySelector("model-viewer#step");
const select = document.querySelector('#variant');
const controlsDiv = document.querySelector(".btnGroup");
const butGroup = document.querySelector('.btnGroup');
const dark_btt = document.getElementById('dark_id');
const MatrialTitle = document.querySelector('#MatrialTitle');
var optionBar = document.querySelector('.option-bar');
//const StepView = document.querySelector('#MatrialTitle');
const s3_path = "https://latham-models.s3.ap-southeast-2.amazonaws.com";
const s3_path_generatedmodel = s3_path +'/generatedmodels/'
const s3_path_models = s3_path +'/models/'

const generatedPath = "generatedmodel";
// generatedPath + sceneId-STP.gltf

const models = [
  {
    "sceneId": "775S",
    "Title": "775S",
    "modelPath": s3_path_models+"775S/775S"
  },
  {
    "sceneId": "AB-775S",
    "Title": "AB-775S",
    "modelPath": s3_path_models+"775S/AB-775S"
  },
  {
    "sceneId": "AW-775S",
    "Title": "AW-775S",
    "modelPath": s3_path_models+"775S/AW-775S"
  },
  {
    "sceneId": "B775S",
    "Title": "B775S",
    "modelPath": s3_path_models+"775S/B775S"
  },
  {
    "sceneId": "AB-FA501S",
    "Title": "AB-FA501S",
    "modelPath": s3_path_models+"FA501S/AB-FA501S"
  },
  {
    "sceneId": "AW-FA501S",
    "Title": "AW-FA501S",
    "modelPath": s3_path_models+"FA501S/AW-FA501S"
  },
  {
    "sceneId": "BFA501S",
    "Title": "BFA501S",
    "modelPath": s3_path_models+"FA501S/BFA501S"
  },
  {
    "sceneId": "FA501S",
    "Title": "FA501S",
    "modelPath": s3_path_models+"FA501S/FA501S"
  },
  {
    "sceneId": "BFA591S",
    "Title": "BFA591S",
    "modelPath": s3_path_models+"FA591S/BFA591S"
  },
  {
    "sceneId": "FA591S",
    "Title": "FA591S",
    "modelPath": s3_path_models+"FA591S/FA591S"
  },
  {
    "sceneId": "AB-FA601S",
    "Title": "AB-FA601S",
    "modelPath": s3_path_models+"FA601S/AB-FA601S"
  },
  {
    "sceneId": "AW-FA601S",
    "Title": "AW-FA601S",
    "modelPath": s3_path_models+"FA601S/AW-FA601S"
  },
  {
    "sceneId": "FA601S",
    "Title": "FA601S",
    "modelPath": s3_path_models+"FA601S/FA601S"
  },
  {
    "sceneId": "AB-FA711ST",
    "Title": "AB-FA711ST",
    "modelPath": s3_path_models+"FA711ST/AB-FA711ST"
  },
  {
    "sceneId": "AW-FA711ST",
    "Title": "AW-FA711ST",
    "modelPath": s3_path_models+"FA711ST/AW-FA711ST"
  },
  {
    "sceneId": "FA711ST",
    "Title": "FA711ST",
    "modelPath": s3_path_models+"FA711ST/FA711ST"
  },
  {
    "sceneId": "BFA711ST",
    "Title": "BFA711ST",
    "modelPath": s3_path_models+"FA711ST/BFA711ST"
  },
  {
    "sceneId": "AB-734ST",
    "Title": "AB-734ST",
    "modelPath": s3_path_models+"FA734ST/AB-734ST"
  },
  {
    "sceneId": "AW-734ST",
    "Title": "AW-734ST",
    "modelPath": s3_path_models+"FA734ST/AW-734ST"
  },
  {
    "sceneId": "B734ST",
    "Title": "B734ST",
    "modelPath": s3_path_models+"FA734ST/B734ST"
  },
  {
    "sceneId": "734ST",
    "Title": "734ST",
    "modelPath": s3_path_models+"FA734ST/734ST"
  },
  {
    "sceneId": "BFA741ST",
    "Title": "BFA741ST",
    "modelPath": s3_path_models+"FA741ST/BFA741ST"
  },
  {
    "sceneId": "FA741ST",
    "Title": "FA741ST",
    "modelPath": s3_path_models+"FA741ST/FA741ST"
  },
  {
    "sceneId": "AB-FA751ST",
    "Title": "AB-FA751ST",
    "modelPath": s3_path_models+"FA751ST/AB-FA751ST"
  },
  {
    "sceneId": "AW-FA751ST",
    "Title": "AW-FA751ST",
    "modelPath": s3_path_models+"FA751ST/AW-FA751ST"
  },
  {
    "sceneId": "FA751ST",
    "Title": "FA751ST",
    "modelPath": s3_path_models+"FA751ST/FA751ST"
  }

];

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
var currentModel = models.find(o => o.sceneId.toLocaleLowerCase() === params.id.toLocaleLowerCase());
const URLtext = CreateURL(currentModel.modelPath);
document.getElementById("nameTitle").textContent = currentModel.Title;
document.title = "Latham AR: " + currentModel.Title;

const idVal = urlSearchParams.toString();
const isSingleModel = idVal.includes("AW-") || idVal.includes("AB-");

///RUN TImeStart
//#region  as soon as the pageloaded
dark_btt.style.display = "none";
optionBar.classList.remove('with-dark-mode');
createARButton();
arPromoter();

modelViewerVariants.src = URLtext[1];

modelViewerVariants.addEventListener('load', () => {
  document.querySelector("body").classList.add('loaded');
  document.querySelector(".progress-bar").classList.add('hide');
  const names = modelViewerVariants.availableVariants;
  if (names.length > 0) {
    // Clear existing buttons before creating new ones to prevent duplicates
    deleteChild();
    for (const name of names) {
      if (name !== 'Lumo-Dark') {
        createButtonForEachButton(name);
      }
    }

    // set first list to become active/selected after all the matrial lodead
    if (firstInit) {
      setActiveMatrial(names[0]);
      blinkVariant();
      firstInit = false;
    } else {
      setActiveMatrial(activeMatrialDataId);
    }
  } else if (isSingleModel) {
    setGeneratedModelUrl(getUrlOfModel());
  }
});

function blinkVariant() {
  const button = document.querySelector(".Matrial-Button.active");
  if (button) {
      button.classList.add("blink");

      setTimeout(() => {
          button.classList.remove("blink");
      }, 6000);
  }
}
//#endregion
function islumo() {
  return (modelViewerVariants.variantName === 'lumo' || modelViewerVariants.variantName === 'Lumo-Dark');
}
////RUN TIME END 

//#region all thr Fution
///All THE Funtion
function CreateURL(url) {
  let nameOfModel = url.substring(url.lastIndexOf('/') + 1);
  let urlOBJ =
    [
      url + '/' + nameOfModel + ".gltf",
      url + '/' + nameOfModel + "-STP.gltf"
    ]
  return urlOBJ;
}

function CrateTheMainControllerDiv() {
  let crt = document.createElement('div');
  crt.className = "controls";
  modelViewerVariants.append(crt);
  return crt;
}

//creating the matrial slot
function CreateMatrialButtonGroup() {
  let btg = document.createElement('div');
  btg.className = 'matrial-button-group';
  controlsDiv.append(btg);
  return btg;
}
//where all the controll button will be created
function createSettingController() {
  let SettingPanal = document.createElement('Dev');
  SettingPanal.className = "Setting-Panal";
  SettingPanal.append(createStepButton());
  controlsDiv.append(SettingPanal);
  SettingPanal.append(CreatBackgroundLightSlider());
}

function CreatBackgroundLightSlider() {
  let SettingPanal = document.createElement('input');
  SettingPanal.type = "range";
  SettingPanal.min = "1";
  SettingPanal.max = "100";
  SettingPanal.addEventListener('input', (event) => {
    changeLightExposer((event.target.value) / 100);
  });
  return SettingPanal;
}
function CreateFieldOfView() {
  let SettingPanal = document.createElement('input');
  SettingPanal.type = "range";
  SettingPanal.min = "0";
  SettingPanal.max = "105";
  SettingPanal.addEventListener('input', (event) => {
    changeFildedOfView((event.target.value + "%"));
  });
  return SettingPanal;
}
function changeLightExposer(val) {
  modelViewerVariants.exposure = val;
}
function changeFildedOfView(val) {
  modelViewerVariants.cameraOrbit = "0deg 100deg " + val;
}

function createStepButton() {
  let stepViewBUtton = document.createElement('button');
  stepViewBUtton.className = "stepViewBTT";
  stepViewBUtton.textContent = "StepView";
  stepViewBUtton.onclick = switchstep;
  return stepViewBUtton;
}

//dropdownOption
function CreateOption(name) {
  const option = document.createElement('option');
  option.value = name;
  option.textContent = name;
  select.appendChild(option);

}
//create Defalt
function createDefaltFuntion() {
  // Adds a default option.
  const option = document.createElement('option');
  option.value = 'default';
  option.textContent = 'Default';
  select.appendChild(option);
}
//addFuntionToOption
function addFuntionToDropDown() {
  select.addEventListener('input', (event) => {
    modelViewerVariants.variantName = event.target.value === 'default' ? null : event.target.value;
  });
}
//create button For each variant 
function createButtonForEachButton(name) {
  const Butbox = document.createElement('div');
  const butt = document.createElement('button');
  const matrial_Text = document.createElement('p');

  Butbox.className = "Matrial-Box";
  butt.className = "Matrial-Button";
  butt.setAttribute('data-id', strToDataId(name));
  let updatedName = "";
  switch (name) {
    case "OffWhite":
      updatedName = "Off White"
      break;
    case "BlueGray":
      updatedName = "Blue Grey"
      break;
    case "SilverGray":
      updatedName = "Silver Grey"
      break;
    case "lumo":
      updatedName = "Lumo"
      break;
    case "smoke":
      updatedName = "Smoke"
      break;
    case "Gray":
      updatedName = "Grey"
      break;
    case "CactusGreen":
      updatedName = "Cactus Green"
      break;
    case "SafetyYellow":
      updatedName = "Safety Yellow"
      break;
    default:
      updatedName = name;
    // code block
  }

  Butbox.textContent = updatedName;
  butt.style.backgroundImage = 'url(/latham-ar/media/materials/' + name + '.jpg)';

  butt.value = name;
  butt.onclick = function () {
    "click", changeRimMatrial(name);
  };
  butt.append(Butbox);
  butGroup.append(butt);
}

//swtching from bar only to Step
function switchstep() {
  if (modelViewerVariants.src === URLtext[0]) {
    deleteChild();
    console.log("baronly");
    modelViewerVariants.src = URLtext[1];
    stepView = !stepView;
  } else {
    deleteChild();
    console.log("Step");
    modelViewerVariants.src = URLtext[0];
    stepView = !stepView;
  }
  arUrl = getUrlOfModel();
}

//swtching from bar only to Step
function switchsingle() {
  if (modelViewerVariants.src === URLtext[0]) {
    deleteChild();
    modelViewerVariants.src = URLtext[1];
    stepView != stepView;
  } else {
    deleteChild();
    modelViewerVariants.src = URLtext[0];
    stepView != stepView;
  }
}

//swtching darkmode only in luman
function switchDark(val) {
  //switching dark moode
  if (islumo()) {
    if (val.checked) {
      changeRimMatrial('Lumo-Dark');
    } else {
      changeRimMatrial('lumo');
    }
  }
}
//delete all the children
function deleteChild() {
  // const e = document.querySelector('.btnGroup');
  butGroup.textContent = "";
}

//funtion when clicked on matrial button 
function changeRimMatrial(val) {
  modelViewerVariants.variantName = val;
  if (val === ('Lumo-Dark')) {
    val = 'lumo';
  }
  if (val != 'lumo') {
    document.getElementById("checkboxswitchdark").checked = false;
  }
  setActiveMatrial(val);
  //testing for dark
  setLightExposerforlumon();
}

function setActiveMatrial(val) {
  activeMatrialDataId = strToDataId(val);
  var buttons = document.querySelectorAll(".Matrial-Button");
  buttons.forEach(box => {
    box.classList.remove('active');
  });
  var matrialActive = document.querySelector('[data-id=' + activeMatrialDataId + ']');
  matrialActive.classList.add('active');
  
  variantnm = (modelViewerVariants.variantName == "Lumo-Dark") ? "lumo-dark" : strToDataId(val);

  let additional = (stepView) ? "-STP" : "";
  const main_url = location.protocol + '//' + ((location.host == "ezystaging.com") ? location.host + "/lathamar" : location.host)
  let url = main_url + "/";

  if (isSingleModel) {
    url = getUrlOfModel();
    url = s3_path_generatedmodel + currentModel.sceneId  + "-" + activeMatrialDataId + additional+".gltf";
  } else {
    
    url += generatedPath + "/" + currentModel.sceneId  + "-" + activeMatrialDataId + additional+".gltf";
    url = s3_path_generatedmodel + currentModel.sceneId  + "-" + variantnm + additional+".gltf";
  }

  // AWS EC2 Dynamic AR URL
  // let qstring = `?id=${currentModel.sceneId}&variant=${variantnm}`+((stepView) ? "&stp=true" : "");
  // url = "http://ec2-54-66-59-140.ap-southeast-2.compute.amazonaws.com:8080/" + qstring;
  console.log(url);

  setGeneratedModelUrl(url);
}

function setGeneratedModelUrl(value) {
  document.getElementById("generatedmodelurl").value = value;
}

function getUrlOfModel() {
  let main_url = location.protocol + '//' + ((location.host == "ezystaging.com") ? location.host + "/lathamar" : location.host)
  //const url = main_url + '/' + currentModel.modelPath + "/" + currentModel.Title + ((stepView) ? "-STP" : "") + ".gltf";
  const url = currentModel.modelPath + "/" + currentModel.Title + ((stepView) ? "-STP" : "") + ".gltf";
  return url;
}

function strToDataId(value) {
  return value.replace(/\W+/g, '-').toLowerCase()
}
function createARButton() {
  let arbt = document.createElement('button');
  arbt.slot = "ar-button";
  arbt.id = "ar-button";
  arbt.textContent = 'View in AR';
  modelViewerVariants.append(arbt);
}

function arPromoter() {
  let ardiv = document.createElement('button');
  let arimg = document.createElement('img');
  ardiv.id = "ar-prompt";
  arimg.src = "/latham-ar/media/icon/ar_hand_prompt.png";
  ardiv.append(arimg);
  modelViewerVariants.append(ardiv);

}
//#endregion

document.getElementById("ar-button").addEventListener("click", function () {
  document.getElementById("default-ar-button").click();
});
document.getElementById("show-tooltip").addEventListener("click", function () {
  if (window.innerWidth > 768) {
    toggleSideNav();
  } else {
    document.getElementById("ar-button").click();
  }
});
document.getElementById("close-tooltip").addEventListener("click", function () {
  toggleSideNav();
});
// element.addEventListener("click", toggleSideNav);

var sideNav = document.getElementById("custom-tooltip");
function toggleSideNav() {
  sideNav.classList.toggle('show');
}

var qrcode = new QRCode("qrcode");

function makeCode() {
  qrcode.makeCode(window.location.href);
}

makeCode();

function setLightExposerforlumon() {
  if (modelViewerVariants.variantName === 'lumo' || modelViewerVariants.variantName === 'Lumo-Dark') {
    dark_btt.style.display = "flex";
    optionBar.classList.add('with-dark-mode');
  } else {
    dark_btt.checked = true;
    dark_btt.style.display = "none";
    optionBar.classList.remove('with-dark-mode');
  }

  if (modelViewerVariants.variantName === 'Lumo-Dark') {
    modelViewerVariants.style.backgroundColor = "#4d4d4d";
    changeLightExposer(0.1);
  } else {
    modelViewerVariants.style.backgroundColor = "#ffffff";
    changeLightExposer(1);
  }
}