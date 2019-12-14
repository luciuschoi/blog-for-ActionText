import { Controller } from 'stimulus';
const helpers = require('./helpers');

export default class extends Controller {
  static targets = [ 'files' ]

  connect() {
    console.log("file_upload_controller was connected...");
    this.filesTarget.addEventListener('change', function (e) {   
      let files = e.target.files;
      let fileNames = [];
      let data = [];
      let el = $(this).parent();
      if (!!files && files.length >= 1) {
        let files_array = files
        $(this).siblings(".custom-file-label").addClass("selected").html(`${files.length}개의 파일을 선택함.`);
        let ul_el = el.find('.list-group')[0]
        if(ul_el == undefined){
          ul_el = el.append("<ul class='list-group mt-2'>").find('ul');
        } else {
          ul_el.innerHTML = ''
          ul_el = el.find('ul')
        }
        $.each(files_array, function(index, file){
          fileNames.push(file.name);
          data.push(file)
          ul_el.append('<li class="list-group-item list-group-item-light">'+(index+1) + ". <strong>" + file.name + "</strong>, <i>" + helpers.humanFileSize(file.size, 2)+ "</i>, <span class='badge badge-success'>" + file.type + '</span></li>');
        });
      } 
    }, false);
  }
}