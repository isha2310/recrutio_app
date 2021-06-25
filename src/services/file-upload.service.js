class FileUploadService {
  upload(file) {
    let formData = new FormData();

    formData.append("snap", file);

    let bearer = "Bearer " + localStorage.getItem("rec-token");
    for (var pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
  }

    return fetch(`https://recrutio.herokuapp.com/api/candidate/snap`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: bearer,
        "Access-Control-Allow-Origin": "*",
      },
      body: formData,
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));
  }
}

export default new FileUploadService();