class CandidatePost {
  upload(data) {
    let formData = new FormData();

    let bearer = "Bearer " + localStorage.getItem("rec-token");
    let snaps = data.snaps
    if(snaps !==[]){
        for(let i = 0; i < snaps.length; i++){
            formData.append('snaps', snaps[i] )
        }
    }
    formData.append("caption", data.caption);
    for(let i =0; i<data.technologies.length; i++){
      formData.append('technologies', data.technologies[i])
    }
    //formData.append("technologies", data.technologies);
    if (data.repolink) formData.append("repolink", data.repolink);
    if (data.link) formData.append("link", data.link);

    return fetch(`https://recrutio.herokuapp.com/api/candidate/post`, {
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

export default new CandidatePost();