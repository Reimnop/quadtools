const dragArea = document.querySelector(".uploadfile__dragarea"),
browseButton = document.querySelector(".uploadfile__button"),
browseInput = document.querySelector("input");

browseButton.onclick = () => {
    browseInput.click();
};

browseInput.addEventListener("change", () => {
    OnFileDrop(browseInput.files[0]);
});

dragArea.addEventListener("dragover", (event) => {
    event.preventDefault();

    if (event.target.className === "uploadfile__dragarea")
    {
        console.log("DragOver");
        
        dragArea.style.borderStyle = "solid";
        dragArea.style.transform = "scale(1.025)";
        
        dragArea.children[2].style.opacity = "0";
        dragArea.children[3].style.opacity = "0";
        dragArea.children[3].style.pointerEvents = "none";
    }
});

dragArea.addEventListener("dragleave", (event) => {
    event.preventDefault();
    console.log("DragLeave");
    
    dragArea.style.borderStyle = "";
    dragArea.style.transform = "";

    dragArea.children[2].style.opacity = "";
    dragArea.children[3].style.opacity = "";
    dragArea.children[3].style.pointerEvents = "";
});

dragArea.addEventListener("drop", (event) => {
    event.preventDefault();
    console.log("Drop")

    dragArea.style.borderStyle = "";
    dragArea.style.transform = "";

    dragArea.children[2].style.opacity = "";
    dragArea.children[3].style.opacity = "";

    OnFileDrop(event.dataTransfer.files[0]);
});

let globalFile;

function OnFileDrop(file) {

    if (file === undefined)
    {
        return;
    }

    console.log(`Dropped file: ${file.name}`);
    console.log(`File type: ${file.type}`);

    let extensions = ["image/png", "image/jpg", "image/jpeg"];
    if (extensions.includes(file.type)) {
        dragArea.children[4].style.display = "none";
        dragArea.children[5].children[1].innerHTML = `Uploaded ${file.name}!`;
        dragArea.children[5].style.display = "block";

        document.querySelector(".tto__content").style.gridTemplateColumns = "1fr 1fr";
        document.getElementById("column2").style.display = "flex";

        document.getElementById("usetransparency").checked = !(["image/jpg", "image/jpeg"].includes(file.type));
        globalFile = file;

    } else {
        dragArea.children[4].style.display = "block";
        dragArea.children[5].style.display = "none";
    }
}

document.querySelector(".convertbutton").onclick = function (event) {
    UpdateImage(globalFile, document.getElementById("usetransparency").checked);
}

let output = "";

function UpdateImage(file, alpha) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let img = new Image();

    img.onload = function () {

        let pixelStrings = [];
        pixelStrings.push("<line-height=14.5><cspace=-0.65>");

        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

        let lastPix = null;
        for (let y = 0; y < img.naturalHeight; y++) {
            for (let x = 0; x < img.naturalWidth; x++) {
                let pixel = context.getImageData(x, y, 1, 1).data;
				let pixStr = `<#${rgbToHex(pixel[0], pixel[1], pixel[2])}${alpha ? numToHex(pixel[3]) : ''}>`;
                if (pixStr != lastPix) {
                    pixelStrings.push(pixStr);
                }
                lastPix = pixStr;
                pixelStrings.push(`█`);
            }
            pixelStrings.push('<br>');
        }

        output = pixelStrings.join("");
        console.log(output);
        document.querySelector(".preview").innerText = output;
        document.querySelector(".charcount").children[0].innerHTML = `Symbols: ${output.length}/16382`;
        document.getElementById("symbollimit").style.display = output.length > 16382 ? "block" : "none";
        URL.revokeObjectURL(img.src);

        document.querySelector(".tto__content").style.gridTemplateColumns = "1fr 1fr 1fr";
        document.getElementById("column3").style.display = "block";
    };

    img.src = URL.createObjectURL(file);
}

document.querySelector(".preview").onclick = function () {
    window.getSelection().selectAllChildren(this);
};

function numToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b) {
    return numToHex(r) + numToHex(g) + numToHex(b);
}

function rgbaToHex(r, g, b, a) {
    return numToHex(r) + numToHex(g) + numToHex(b) + numToHex(a);
}

document.querySelector(".preview__copybutton").onclick = function () {

    window.getSelection().empty();
    window.getSelection().selectAllChildren(document.querySelector(".preview"));
    document.execCommand('copy');
    window.getSelection().empty();


    let popup = document.querySelector(".preview__copybutton__popup");
    popup.animate([
    {
        transform: "scale(1.075)",
    },
    {
        transform: "scale(1)",
    }
    ], {
        duration: 1000,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    });

    popup.animate([
    {
        opacity: 1
    },
    {
        opacity: 0
    }
    ], {
        duration: 1000
    });
};