const fileInput = document.getElementById("image-file")
const outputBox = document.getElementById("output")
const width = document.getElementById("width")
const height = document.getElementById("height")
const display = document.getElementById("display")
const imageReader = document.getElementById("image-reader")
const previewScale = document.getElementById("preview-scale")
const overideParticle = document.getElementById("overide-particle")
const overideParticleLabel = document.getElementById("overide-particle-label")
const overideParticleInput = document.getElementById("overide-particle-input")
const overideScale = document.getElementById("overide-scale")
const overideScaleLabel = document.getElementById("overide-scale-label")
const overideScaleInput = document.getElementById("overide-scale-input")
const convertButton = document.getElementById("convert")

let scaleFactor = 100
previewScale.value = 100

let imgWidth
let imgHeight

let pixelData = []
let commands = []

const convert = function(){
    commands = []
    let particle = "dust"
    if (overideParticle.checked){
        particle = overideParticleInput.value
    }
    let xParticleDist = width.value / imgWidth
    let yParticleDist = height.value / imgHeight
    let output = ""
    for (let i = 0; i < pixelData.length; i++){
        for (let j = 0; j < pixelData[i].length; j++){
            if (pixelData[i][j][3] > 0){
                if (overideParticle.checked){
                   commands.push(`\nparticle ${particle} ^${j * xParticleDist} ^${i * yParticleDist} ^ 0 0 0 0 1`)
                } else{
                    commands.push(`particle ${particle}{scale:[${pixelData[i][j][0]},${pixelData[i][j][1]},${pixelData[i][j][2]}],scale:${pixelData[i][j][3]}} ^${j * xParticleDist} ^${i * yParticleDist} ^ 0 0 0 0 1`)
                }
            }
        }
    }
    output = commands.join("\n")

    outputBox.value = output
    
}

convertButton.onclick = convert

overideScale.onchange = function(){
    if (overideScale.checked){
        overideScaleInput.classList = "small"
        overideScaleLabel.classList = ""
    } else{
        overideScaleInput.classList = "hidden"
        overideScaleLabel.classList = "hidden"
    }
}

overideParticle.onchange = function(){
    if (overideParticle.checked){
        overideParticleInput.classList = "small"
        overideParticleLabel.classList = ""
    } else{
        overideParticleInput.classList = "hidden"
        overideParticleLabel.classList = "hidden"
    }
}

previewScale.onchange = function(){
    scaleFactor = previewScale.value
    resizeDisplay()
}

const resizeDisplay = function(){
    let scaledWidth = width.value / height.value
    display.width = scaledWidth * scaleFactor
    display.height = scaleFactor
}

const readImageData = function(imgWidth,imgHeight,data){
    width.value = imgWidth
    height.value = imgHeight
    resizeDisplay()
    pixelData = []

    for (let i = 0; i < imgHeight; i++){
        pixelData.push([])
    }

    let temp = []

    for (let i = 0; i < data.length - 1; i += 4){
        temp.push([data[i]/255,data[i+1]/255,data[i+2]/255,data[i+3]/255])
    }
    for (let i = 0; i < imgHeight; i++){
        for (let j = 0; j < imgWidth; j++){
            pixelData[i].push(temp[j])
        }
    }
}

fileInput.onchange = function(event){
    var target = event.target
    var files = target.files
    if (files && files.length && FileReader){
        const reader = new FileReader()
        reader.onload = function(){
           
           if (imageReader.getContext){
            var ctx = imageReader.getContext('2d')
            const img = new Image()
            img.src = reader.result
            display.src = reader.result
            img.onload = function(){
                imgWidth = img.width
                imgHeight = img.height
                imageReader.width = img.width
                imageReader.height = img.height
                ctx.drawImage(img,0,0)
                const data = ctx.getImageData(0,0,img.width,img.height)
                readImageData(data.width,data.height,data.data)
                }
           }
        }
        reader.readAsDataURL(files[0])
    }
}

width.addEventListener("input", function(){
    resizeDisplay()
})

height.addEventListener("input", function(){
    resizeDisplay()
})

width.value = 16
height.value = 9
resizeDisplay()

overideScaleInput.value = 1
