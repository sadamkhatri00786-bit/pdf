// Show previews of selected images
document.getElementById("imageInput").addEventListener("change", function () {
  let preview = document.getElementById("preview");
  preview.innerHTML = "";
  for (let file of this.files) {
    let img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    preview.appendChild(img);
  }
});

// Convert selected images into PDF
document.getElementById("convertBtn").addEventListener("click", function () {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  let input = document.getElementById("imageInput");
  if (input.files.length === 0) {
    alert("⚠️ Please select at least one image!");
    return;
  }

  for (let i = 0; i < input.files.length; i++) {
    let file = input.files[i];
    let reader = new FileReader();

    reader.onload = function (e) {
      let img = new Image();
      img.src = e.target.result;
      img.onload = function () {
        let pageWidth = pdf.internal.pageSize.getWidth();
        let pageHeight = pdf.internal.pageSize.getHeight();
        let ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
        let width = img.width * ratio;
        let height = img.height * ratio;
        let x = (pageWidth - width) / 2;
        let y = (pageHeight - height) / 2;

        pdf.addImage(img, "JPEG", x, y, width, height);

        if (i < input.files.length - 1) {
          pdf.addPage();
        } else {
          pdf.save("converted.pdf");
        }
      };
    };
    reader.readAsDataURL(file);
  }
});
