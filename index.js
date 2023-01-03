const metaJsonLink = "https://raw.githubusercontent.com/Templarian/MaterialDesign-SVG/master/meta.json";
const allIconsDIV = document.getElementById("all-icons");

let highestVersion = 0;

let allIconsJSON = [];

async function load(){
	startLoading()
	const metaJson = await fetch(metaJsonLink).then(res => res.json());
	
	metaJson.forEach(async icon => {
		const buildIcon = await iconBuilder(icon);
		allIconsDIV.appendChild(buildIcon);
	});
	stopLoading()
	allIconsJSON = metaJson;
	document.getElementById("shownamount").innerText = metaJson.length;
	document.getElementById("totalamount").innerText = metaJson.length;
	loadTags()
	doVersion()
}

load();

const tags = []

function compareVersion(version){
	let splitversion = version.split(".").join("")
	if(splitversion > highestVersion){
		highestVersion = version
	}
}

function doVersion(){
	let cssLink = document.getElementById("cssLink");
	const csslinkversion = cssLink.href.split("font@")[1].split("/")[0]
	if(csslinkversion != highestVersion){
		let splitversion = csslinkversion.split(".").join("")
		if(splitversion > highestVersion){
			highestVersion = csslinkversion
		}
		cssLink.href = `//cdn.jsdelivr.net/npm/@mdi/font@${highestVersion}/css/materialdesignicons.min.css`
	}
	document.getElementById("version").innerText = "v" + highestVersion;
}

function loadTags(){
	allIconsJSON.forEach(icon => {
		addTags(icon)
	})

	const tagSelect = document.getElementById("tag-select");

	tags.forEach(tag => {
		const option = document.createElement("option");
		option.value = tag;
		option.innerText = tag;
		tagSelect.appendChild(option);
	})
	

}

function addTags(icon){
	icon.tags.forEach(tag => {
		if(!tags.includes(tag)){
			tags.push(tag)
		}
	})
}


document.getElementById("tag-select").onchange = () => {
	startLoading()
	const tags = document.getElementById("tag-select").value;
	console.log(tags)
	allIconsDIV.innerHTML = "";
	let amount = 0
	allIconsJSON.forEach(async icon => {
		if(icon.tags.includes(tags) || tags == "all"){
			amount++
			const buildIcon = await iconBuilder(icon);
			allIconsDIV.appendChild(buildIcon);
		}
	});
	
	document.getElementById("shownamount").innerText = amount;
	stopLoading()


}

document.getElementById("searchbtn").onclick = () => {
	
	startLoading()
	const search = document.getElementById("search").value.toLowerCase() || "";
	allIconsDIV.innerHTML = "";
	let amount = 0

	allIconsJSON.forEach(async icon => {
		if(searchIcon(icon, search)){
			const buildIcon = await iconBuilder(icon);
			allIconsDIV.appendChild(buildIcon);
			amount++
		}
	});
	document.getElementById("shownamount").innerText = amount;
	stopLoading()
}

function searchIcon(icon, search){
	if(icon.name.toLowerCase().includes(search) || icon.author.toLowerCase().includes(search) || icon.tags.join(" ").toLowerCase().includes(search) || icon.aliases.join(" ").toLowerCase().includes(search)){
		return true
	}
	return false
}

async function iconBuilder(icon){
	const iconSpan = document.createElement("span");
	const iconI = document.createElement("i");
	iconI.classList.add("mdi");
	iconI.classList.add("mdi-" + icon.name);
	iconI.classList.add("icon__icon")

	if(icon.author != "Google"){
		iconSpan.classList.add("icon__icon--custom")
	}

	iconSpan.appendChild(iconI);
	
	const tooltipSpan = document.createElement("span");
	tooltipSpan.classList.add("tooltiptext");
	tooltipSpan.innerHTML = `<p>${icon.name}</p>
	<p style="font-size: 75%">${icon.author}</p>`;


	iconSpan.classList.add("icon");
	iconSpan.classList.add("tooltip")
	iconSpan.appendChild(tooltipSpan);
	iconSpan.onclick = () => {
		// alert(JSON.stringify(icon))
		showIconModal(icon)
	}

	compareVersion(icon.version)

	return iconSpan;
}

function showIconModal(icon){
	document.getElementById("modal").classList.remove("hidden");
	document.getElementById("overlay").classList.remove("hidden");

	document.getElementById("modal_icon-name").innerText = icon.name;
	document.getElementById("modal_icon-author").innerText = "Author: " + icon.author;
	document.getElementById("modal_icon-tags").innerText = "Tags: " + icon.tags.join(", ");
	document.getElementById("modal_icon-icon").classList.add("mdi-" + icon.name);
	document.getElementById("modal_icon-icon").classList.add("icon__icon");
	document.getElementById("modal_icon-aliases").innerText = "Aliases: " + icon.aliases.join(", ")

	document.getElementById("modal_icon-copy-btn").onclick = () => {
		copyToClipboard("mdi mdi-"+icon.name)
			document.getElementById("modal_icon-copy-btn").innerText = "Copied!"
			setTimeout(() => {
				document.getElementById("modal_icon-copy-btn").innerText = "Copy"
			}, 1000)
	}

}

function copyToClipboard(text) {
	  var dummy = document.createElement("textarea");
	  document.body.appendChild(dummy);
	  dummy.value = text;
	  dummy.select();
	  document.execCommand("copy");
	  document.body.removeChild(dummy);
	}

function closeModal(){
	document.getElementById("modal").classList.add("hidden");
	document.getElementById("overlay").classList.add("hidden");
}

document.getElementById("modal-close-button").onclick = () => {
	closeModal()
}

document.getElementById("overlay").onclick = () => {
	closeModal()
}

function startLoading(){
	document.getElementById("loading").style.display = "block";
}

function stopLoading(){
	document.getElementById("loading").style.display = "none";
}
