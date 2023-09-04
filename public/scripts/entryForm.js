import { decodeHTML } from "./utils.js";
// import tinymce from "tinymce/tinymce";

function renderEntryForm(
  targetElement,
  { entryContent = "", entryTitle = "", errors = [] } = {},
  httpMethod = "POST"
) {
  let userid;
  let entryid;

  if (targetElement) {
    var entry = targetElement.closest(".entry");
    if (entry) {
      userid = entry.getAttribute("data-user");
      entryid = entry.getAttribute("data-id");
    }
  }

  if (!targetElement) {
    targetElement = document.getElementById("page-top-form-container");
    userid = targetElement.getAttribute("data-user");
  }

  const form = document.createElement("form");
  form.action = `/dashboard/${userid}`;
  if (httpMethod === "PUT") {
    form.action = `/dashboard/${userid}/${entryid}`;
  }
  form.className = "entry-form";
  form.method = httpMethod;

  form.innerHTML = `
        <label for="entry"><h3>Document Content:</h3></label>
        <textarea id="active-tiny-textarea" class="entry-textarea tinyTextarea" name="entry"></textarea>
        <label class="titleinput-label" for="entry-title"><h3>Title:</h3><span>(optional)</span></label>
        <input class="entry-titleinput" type="text" name="entry-title" />
        <div class="form-buttons-container">
        <button type='submit'> Save </button>
        <button type='button' class='undo-form-button'>Undo</button>
        </div>
    `;

  // Safely setting input values
  const textarea = form.querySelector(".entry-textarea");
  textarea.value = decodeHTML(entryContent);
  form.querySelector('[name="entry-title"]').value = decodeHTML(entryTitle);

  //expanding textarea to fit content size
  // resizeTextarea(textarea);
  // textarea.addEventListener("input", function () {
  //   resizeTextarea(textarea);
  // });

  // make undo remove the form
  const undoButton = form.querySelector(".undo-form-button");
  undoButton.addEventListener("click", function () {
    if (entry) {
      //the form is an edit entry form
      entry.classList.remove("expanded-entry");
      targetElement.remove();
    } else {
      // the form is new entry form
      const newEntryButton = document.getElementById("new-entry-button");
      newEntryButton.style.display = "block";
      while (targetElement.firstChild) {
        targetElement.removeChild(targetElement.firstChild);
      }
    }
  });

  errors.forEach((error) => {
    const errorElem = document.createElement("p");
    errorElem.className = "warning";
    errorElem.textContent = error.msg;

    if (error.path === "entry") {
      form
        .querySelector(".entry-textarea")
        .insertAdjacentElement("beforebegin", errorElem);
    } else if (error.path === "entry-title") {
      form
        .querySelector('[name="entry-title"]')
        .insertAdjacentElement("beforebegin", errorElem);
    }
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const tinyContent = tinymce.get('active-tiny-textarea').getContent();
    formData.set('entry', tinyContent);

    try {
      const response = await fetch(form.action, {
        method: httpMethod,
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = data.redirectUrl;
      } else if (data.errors) {
        targetElement.innerHTML = "";
        renderEntryForm(
          targetElement,
          {
            entryContent: data.entryContent || "",
            entryTitle: data.entryTitle || "",
            errors: data.errors || [],
          },
          httpMethod
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  targetElement.appendChild(form);
  tinymce.remove();
  tinymce.init({
    selector: "textarea.tinyTextarea",
    plugins: "lists link image table code help wordcount autoresize",
  });
}

// function resizeTextarea(textarea) {
//   let lineCount = (textarea.value.match(/\n/g) || []).length + 1;
//   textarea.rows = lineCount;
// }


export { renderEntryForm };
