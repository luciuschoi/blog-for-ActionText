위지위그 에디터의 쉬운 설치, 파일의 쉬운 업로드, 업로드된 이미지의 갤러리 보기 

# ActionText / ActiveStorage / FancyBox

**레일스 6** 프로젝트를 생성하여 위지위그 에디터를 이용하여 이미지를 삽입하면서 글을 작성하고 별도로 파일을 첨부하고 이미지 파일을 첨부할 경우 갤러리 형태로 전용뷰어를 이용하는 방법에 대해서 설명한다.

* 레일스 6
* **Webpack**을 이용하하여 **stimulus.js** 설치
* 업로드된 이미지를 가공하기 위해 시스템에 **Imagemagick** and **ghostscript** 설치



## 1. 토이 프로젝트의 생성

**blog** 라는 프로젝트를 생성하고 프로젝트 디렉토리로 이동한다.

```bash
$ rails new blog --webpack=stimulus --database=postgresql && cd blog
```

**bootstrap**, **jquery**, **popper.js** 를 설치한다. 

```bash
$ yarn add bootstrap jquery popper.js
```

**app/javascript/stylesheets** 디렉토리를 생성한 후 **application.scss** 파일을 생성한다. 

```scss
@import 'bootstrap/dist/css/bootstrap.min.css';
```

**app/javascript/packs/application.js** 파일을 열고 아래와 같이 추가한다.

```javascript
import 'bootstrap';
import '../stylesheets/application'
```

**config/webpack/environment.js** 파일을 열고 아래와 같이 변경한다.

```javascript
const { environment } = require('@rails/webpacker')

const webpack = require('webpack')
environment.plugins.append('Provide', 
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    Popper: ['popper.js', 'default']
}))

module.exports = environment
```

**Post** 리소스를  **scaffolding** 한다. 

```bash
$ bin/rails g scaffold Post title content:text
```

생성된 **Post** 모델을  마이그레이션을 한다.

```bash
$ bin/rails db:migrate
```

> 프로젝트를 생성한 직후라면 아래와 같이 **db:create** 작업을 먼저 해 주어야 한다.
>
> ```bash
> $ bin/rails db:create
> ```

**config/routes.rb** 파일을 열고 **root** 경로를 지정한다. 

```ruby
Rails.application.routes.draw do
  root "posts#index"
  resources :posts
end
```

이제 터미널에서 레일스 로컬 서버와  **webpack-dev-server**를 실행하고 **localhost:3000** 로 접속한다.

``` bash
$ bin/rails server
```

```bash
$ bin/webpack-dev-server
```

```bash
$ open http://localhost:3000
```

**Post** 를 생성하고 수정 삭제해 본다. 지금까지 제대로 따라했다면 이상없이 이 작업들이 수행되어야 한다. 

![2019-12-10_05-18-50](/app/assets/images/readme/2019-12-10_05-18-50.png)

## 2. Bootstrap 확인

**app/views/layouts/application.html.erb** 파일을 열고 아래와 같이 **body** 태그 내에 **container** 클래스를 지정해 준다.

```erb
<body>
  <div class="container">
    <%= yield %>
  </div>
</body>
```

![2019-12-10_05-19-58](/app/assets/images/readme/2019-12-10_05-19-58.png)

위와 같이 좌우로 여백이 보이게 되면 **Bootstrap**이 제대로 작동하는 것이다. 

또한 **Bootstrap**의 **tooltip**과 **popover**가 제대로 동작하는 것까지 확인하면 완벽하다.

우선 **app/javascript/packs/application.js** 파일을 열고 아래와 같이 추가한다.

```javascript
document.addEventListener('turbolinks:load', () => {
  $('[data-toggle="tooltip"]').tooltip()
  $('[data-toggle="popover"]').popover()
})
```

그리고 **posts#index** 뷰파일(**app/views/posts/index.html.erb**)을 열고 하단에 아래의 코드를 추가한다. 

```erb
<h2>
  Bootstrap Tooltips
</h2>
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Tooltip on top">
  Tooltip on top
</button>
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="right" title="Tooltip on right">
  Tooltip on right
</button>
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom">
  Tooltip on bottom
</button>
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="left" title="Tooltip on left">
  Tooltip on left
</button>
```

그리고 아래의 코드도 추가해 준다. 

```erb
<h2>
  Bootstrap Popovers
</h2>
<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="top" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on top
</button>

<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="right" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on right
</button>

<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus
sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on bottom
</button>

<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="left" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on left
</button>
```

![2019-12-10_05-42-45](/app/assets/images/readme/2019-12-10_05-42-45.png)

**posts#index** 뷰파일에서 **content** 부분을 삭제하고 아래와 같이 수정한다.

```erb
<table class='table'>
  <thead>
    <tr>
      <th>Title</th>
      <th colspan="3"></th>
    </tr>
  </thead>

  <tbody>
    <% @posts.each do |post| %>
      <tr>
        <td><%= post.title %></td>
        <td><%= link_to 'Show', post %></td>
        <td><%= link_to 'Edit', edit_post_path(post) %></td>
        <td><%= link_to 'Destroy', post, method: :delete, data: { confirm: 'Are you sure?' } %></td>
      </tr>
    <% end %>
  </tbody>
</table>

<%= link_to 'New Post', new_post_path, class: 'btn btn-primary' %>

<hr>
```

![2019-12-10_05-58-40](/app/assets/images/readme/2019-12-10_05-58-40.png)

위의 캡쳐 이미지에서와 같이 **"New Post"** 버튼의 글자 색상이 잘 보이지 않게 되는데, 이것은 **Post** 리소스를  **scaffolding**할 때 생성된 **app/assets/stylesheets/scaffolds.scss** 파일에 정의된 `a` 태그 스타일 때문에 발생하는 현상이다. 따라서 아래와 같이 코멘트 처리하거나 삭제한다.

``` scss
// a {
//   color: #000; }

// a:visited {
//   color: #666; }

// a:hover {
//   color: #fff;
//   background-color: #000; }
```

> 노트 : 물론 scaffolds.scss 파일을 삭제해도 된다. 

![2019-12-10_06-05-16-5925617](/app/assets/images/readme/2019-12-10_06-05-16-5925617.png)

## 3. 폼 파셜에 Bootstrap 적용하기

**input** 필드와 **submit** 버튼에 각각 **Bootstrap**용 스타일 클래스를 적용한다. 

```erb
<%= form_with(model: post, local: true) do |form| %>
  <% if post.errors.any? %>
    <div id="error_explanation">
      <h2><%= pluralize(post.errors.count, "error") %> prohibited this post from being saved:</h2>

      <ul>
        <% post.errors.full_messages.each do |message| %>
          <li><%= message %></li>
        <% end %>
      </ul>
    </div>
  <% end %>

  <div class="field">
    <%= form.label :title %>
    <%= form.text_field :title, class: 'form-control' %>
  </div>

  <div class="field">
    <%= form.label :content %>
    <%= form.text_area :content, rows: 5, class: 'form-control' %>
  </div>

  <div class="actions">
    <%= form.submit class: 'btn btn-primary' %>
  </div>
<% end %>
```

적용 전의 모습

![2019-12-10_06-12-14](/app/assets/images/readme/2019-12-10_06-12-14.png)

적용 후의 모습

![2019-12-10_06-13-24](/app/assets/images/readme/2019-12-10_06-13-24.png)

## 4. ActionText 적용하기

먼저 터미널에서 설치 작업을 해야 한다.

```bash
$ bin/rails action_text:install
```

```
Copying actiontext.scss to app/assets/stylesheets
      create  app/assets/stylesheets/actiontext.scss
Copying fixtures to test/fixtures/action_text/rich_texts.yml
      create  test/fixtures/action_text/rich_texts.yml
Copying blob rendering partial to app/views/active_storage/blobs/_blob.html.erb
      create  app/views/active_storage/blobs/_blob.html.erb
Installing JavaScript dependencies
         run  yarn add trix@^1.0.0 @rails/actiontext@^6.0.1 from "."
yarn add v1.19.2

···

Adding trix to app/javascript/packs/application.js
      append  app/javascript/packs/application.js
Adding @rails/actiontext to app/javascript/packs/application.js
      append  app/javascript/packs/application.js
Copied migration 20191209211547_create_active_storage_tables.active_storage.rb from active_storage
Copied migration 20191209211548_create_action_text_tables.action_text.rb from action_text
```

> **노트**: 이 과정에서 여러가지 작업이 이루어 진다. 
> 
> 1. 전용 CSS 파일인 **actiontext.scss** 파일이 생성됨.
> 2. 테스트용 fixture 인 **rich_texts.yml** 파일이 생성됨.
> 3. 에디터에 삽입되는 파일들을 보여주기 위한 뷰 파셜인 **_blob.html.erb** 파일이 생성됨.
> 4. **Trix 에디터**와 **ActionText** 를 yarn 명령으로 설치함.
> 5. **ActiveStorage**를 위한 마이그레이션 파일이 생성됨
> 6. **ActionText**를 위한 마이그레이션 파일이 생성됨.

레일스 마이스레이션 명령을 실행한다.

```bash
$ bin/rails db:migrate
```

다음으로는 **app/modes/post.rb** 파일을 열고 아래와 같이 수정하여 **content** 속성에 **ActionText** 기능이 적용되도록 한다.

```ruby
class Post < ApplicationRecord
  has_rich_text :content
end
```

**app/views/posts/_form.html.erb** 파일을 열고 아래와 같이 **content** 속성에 대한 **input** 헬퍼를 변경한다.

```erb
···
  <div class="field">
    <%= form.label :content %>
    <%= form.rich_text_area :content %>
  </div>
···
```

이제 브라우저에서 지금까지의 작업 결과를 확인하면 아래와 같이 보여야 한다. 

![2019-12-10_06-33-59](/app/assets/images/readme/2019-12-10_06-33-59.png)

> 주의 : **ActionText**를 적용하면 기존의 데이터를 볼 수 없게 된다. 그러나 사라진 것이 아니라 **action_text_rich_texts** 테이블에 **ActionText** 전용 데이터가 생성되지 않아서 그렇다. **posts** 테이블에 보면 그대로 **content** 내용이 존재하는 것을 확인할 수 있게 된다. 기존의 데이터를 **action_text_rich_texts** 테이블로 마이그레이션해 주면 보이게 될 것으로 추측된다.
> https://github.com/rails/rails/issues/35002 에 해결책이 소개되어 있어 따라 해 봤으나 소용이 없었다. 

이제 실제로 글을 작성하고 이미지 파일을 삽입한 후 저장하면 아래와 같이 이미지가 보이지 않게 된다. ![2019-12-11_00-13-23](/app/assets/images/readme/2019-12-11_00-13-23.png)

이것은 이미지를 처리하는 젬이 설치되지 않은 경우이며, **Gemfile** 열고 **image_processing** 젬 라인의 `#` 문자를 제거하고 번들 인스톨한다.

```ruby
gem 'image_processing', '~> 1.2'
```

이제 다시 레일스 서버를 시작한 후 방금 작성한 글을 보게 되면 제대로 이미지 보이게 된다. 

![2019-12-11_00-21-22-5991368](/app/assets/images/readme/2019-12-11_00-21-22-5991368.png)

**Fancybox** 를 설치하면 이미지를 클릭했을 때 풀 페이지 포맷으로 볼 수 있으며 복수개의 이미지를 삽입한 경우 갤러리 형태로도 볼 수 있다. 아래와 같이 설치한다. 

``` bash
$ yarn add @fancyapps/fancybox
```

**app/javascript/application.js** 파일을 열고 아래의 내용을 추가한다.

```javascript
// Fancybox
require('@fancyapps/fancybox/dist/jquery.fancybox.js');
// Fancybox Stylesheet
require('@fancyapps/fancybox/dist/jquery.fancybox.css');
```

다음으로 **app/views/active_storage/blobs/_blob.html.erb** 파일을 열고 아래와 같이 변경한다. 

```erb
···
  <% if blob.representable? %>
    <%= link_to image_tag(blob.representation(resize_to_limit: local_assigns[:in_gallery] ? [ 800, 600 ] : [ 1024, 768 ])), rails_blob_path(blob), data: { fancybox: 'gallery', caption: blob.filename } %>
  <% end %>
···
```

그러나 실제로 렌더링된 결과를 보면 **data-fancybox**와 **data-caption** 속성이 생성되지 않는다. 이에 대한 이슈는 https://github.com/rails/rails/issues/36725 에 이미 알려져 있다. **config/application.rb** 파일을 열고 아래의 내용(5~8 라인)을 추가하여 문제를 해결하였다. 

```ruby
module Blog
  class Application < Rails::Application
    config.load_defaults 6.0

    config.after_initialize do
      ActionText::ContentHelper.allowed_attributes.add 'data-fancybox'
      ActionText::ContentHelper.allowed_attributes.add 'data-caption'
    end
  end
end
```

이제 잘 동작하지만 **Fancybox** 기능을 추가할 경우에 부작용도 관찰되었다. **show** 액션에서는 **Fancybox** 기능이 잘 동작하지만 **edit** 액션의 폼뷰에서는 삽입된 이미지를 클릭하여 삭제하고자 할 때에도 **Fancybox** 보기가 작동하게 되어 해당 이미지를 클릭했을 때 이미지 상단에 보이는 `x`  링크 표시를 클릭할 수 없게 된다는 점이다. 그래서 **_blob.html.erb** 파일에서 **link_to_if** 헬퍼를 사용하여 **action_name == 'edit'** 조건을 지정하였더니, **action_name**이 빈 문자열로 표시되어 제대로 동작하지 않았다. 

그래서 이번에는 다른 방식으로 시도해 보았다. **stimulus.js** 를 이용하는 것이다. 

이를 위해서 **app/javascript/controllers** 디렉토리에 **fancybox_controller.js** 파일을 생성하고 아래와 같이 작성한다. 

```javascript
import { Controller } from 'stimulus';

export default class extends Controller {
  static targets = [ 'blob']

  connect() {
    this.blobTargets.forEach(target => {
      console.log(target.dataset.url)
      console.log(target.src)
      target.outerHTML = `<a href='${target.dataset.url}' data-fancybox='gallery' data-caption='${target.dataset.caption}'><img src='${target.src}'></a>`
    });
  }  
}
```

그리고 **config/application.rb** 파일을 열과 아래와 같이 업데이트한다. 

```ruby
···
    config.after_initialize do
      ActionText::ContentHelper.allowed_attributes.add 'data-target'
      ActionText::ContentHelper.allowed_attributes.add 'data-caption'
      ActionText::ContentHelper.allowed_attributes.add 'data-url'
    end
···
```

**_blob.html.erb** 파일을 열고 아래와 같이 업데이트한다.

```erb
···  
  <% if blob.representable? %>
    <%= image_tag blob.representation(resize_to_limit: local_assigns[:in_gallery] ? [ 800, 600 ] : [ 1024, 768 ]), data: { target: 'fancybox.blob', caption: blob.filename, url: rails_blob_path(blob) } %>
  <% end %>
···
```

이제 **ActionText** 에디터 상에서 삽입된 이미지를 뷰 페이지에서 **Fancybox**로 잘 볼 수 있게 되었다.

-----------------

다음은 **ActionText** 에디터(**Trix**) 내에 삽입된 파일을 별도의 <div> 태그로 표시해 보도록 하겠다. 

**ActionText** 내에 삽입한 파일들은 **@post.content.embeds** 메소드를 호출하여 얻을 수 있다. 

아래와 같이 뷰 파일을 작성하면 그 목록들을 별도로 표시할 수 있다. 

**app/views/posts/show.html.erb** 파일을 열고 아래와 같이 추가한다.

```erb
···
<p>
  <strong>Embeded files(<%= @post.content.embeds.size %>):</strong>
  <% @post.content.embeds.each do |file| %>
    <% if file.representable? %>
      <div style="display:inline-block;position: relative;width:100px;height:100px;margin: 3px;">
        <% if file.content_type.include? 'image'%>
          <%= link_to image_tag(file.variant(resize_to_fill: [100, 100]), class: 'img-fluid rounded'), file, download: true, class: 'border border-primary d-inline-block rounded' %>
        <% else %>
            <%= link_to image_tag(file.preview(resize_to_fill: [100, 100]), class: 'img-fluid rounded'), file, download: true, class: 'border border-primary d-inline-block rounded' %>
        <% end %>
      </div>
    <% else %>
      <%= link_to file.filename, file, download: true, class: 'btn btn-secondary' %>
    <% end %>
  <% end %>
</p>

<hr>
···
```

여기서는 삽입된 파일을 다운로드 받도록 링크를 작성했으며 **link_to** 헬퍼에 **download: true** 옵션을 지정한 것이 주목하기 바랍니다. 이로써 해당 링크를 클릭하면 파일을 다운로드하게 된다. 

-----------------------

다음은 별도의 파일 업로드 기능을 추가해 보자. **ActiveStorage를** 사용하면 쉽게 구현할 수 있다. 

이를 위해서 먼저 **app/models/post.rb** 파일을 열고 아래와 같이 첨부파일을 지정하면 복수개의 파일을 동시에 선택하여 업로드할 수 있게 된다. 

```ruby
class Post < ApplicationRecord
  has_rich_text :content
  has_many_attached :files
end
```

**app/controllers/posts_controller.rb** 파일을 열고 위에서 추가한 `:files` 속성에 대해 **strong parameter**로 등록한다. 

```ruby
···
  private
···
  def post_params
    params.require(:post).permit(:title, :content, files: [])
  end
end
```

그리고 **app/views/posts/_form.html.erb** 파일을 열고 아래의 내용을 추가한다. 

```erb
<div class="field">
  <%= label_tag 'Attachment Files' %>
  <div class='alert alert-secondary'>
    <div class="custom-file" style='height: auto;'>
      <%= form.file_field :files, multiple: true, id: 'customFile', class: 'custom-file-input' %>
      <%= form.label :files, 'Choose Files', for: 'customFile', class: 'custom-file-label' %>
    </div>
  </div>
</div>
```

여기까지 진행한 후 하나 이상의 파일을 선택해 보자. 아무런 변화가 보이지 않는다. 

이제 **stimulus.js** 기능을 이용한다. 이미 **webpack**으로 사용하기 위해  **yarn add** 한 상태이므로 파일 업로드를 위한 컨트롤러를  **app/javascript/controllers/** 디렉토리에 **file_upload_controller.js** 파일명으로 생성하고 아래의 내용을 붙여 넣기 한다.  

```javascript
import { Controller } from 'stimulus';

export default class extends Controller {
  static targets = [ 'files' ]

	connect() {
    console.log("file_upload_controller was connected...");
    this.filesTarget.addEventListener('change', function (e) {   
      // 파일 선택시 처리해야 할 작업
      // ···
      console.log("Files were selected.");
      console.log(e.target.files);
    });
  }
}
```

복수개의 파일을 선택한 후 발생하는 **change** 이벤트를 등록한다.

이 컨트롤러를 적용하기 위해 **app/views/posts/_form.html.erb** 파일을 열고 4번째 줄과 같이 **data-controller="file-upload"** 속성을 추가한다. 그리고 **file** 업로드를 위한 **input** 태그에 대해 **data-target** 속성을 추가하고 `file-upload.files`를 지정한다.

```erb
<div class="field">
  <%= label_tag 'Attachment Files' %>
  <div class='alert alert-secondary'>
    <div data-controller="file-upload" class="custom-file" style='height: auto;'>
      <%= form.file_field :files, multiple: true, id: 'customFile', class: 'custom-file-input', data: { target: 'file-upload.files' } %>
      <%= form.label :files, 'Choose Files', for: 'customFile', class: 'custom-file-label' %>
    </div>
  </div>
</div>
```

이제 5개의 파일을 선택한 후 브라우저 콘솔 창에서 **FileList** 배열값을 확인해 보자. 

![2019-12-14_13-07-57](/app/assets/images/readme/2019-12-14_13-07-57.png)

이렇게 선택한 파일들이 **file input** 태그 아래에 보이도록 **change** 이벤트를 업데이트한다.

```javascript
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
```

**app/javascript/contollers/helpers.js**

```javascript
const formatFileSize = (bytes, decimalPoint) => {
  if(bytes == 0) return '0 Bytes';
  var k = 1000,
      dm = decimalPoint || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

module.exports = {
  humanFileSize: formatFileSize
};
```

![2019-12-14_13-24-49](/app/assets/images/readme/2019-12-14_13-24-49.png)

업로드된 파일을 보여 주기 위해 **show** 액션 뷰 파일과 폼 뷰 파일에 아래의 내용을 추가하고 

```erb
<div id="preview_file_attachments" class='my-3' data-controller='fancybox'>
  <%= render 'preview_file_attachment', post: @post %>
</div>
```

폼 뷰 파일은 

```erb
<div class="field">
  <%= label_tag 'Attachment Files' %>
  <div class='alert alert-secondary'>
    <div id="preview_file_attachments" style='height:auto;'>
      <%= render 'preview_file_attachment', post: form.object %>
    </div>
    <div class="custom-file" data-controller='file-upload' style='height: auto;'>
      <%= form.file_field :files, multiple: true, id: 'customFile', class: 'custom-file-input', data: { target: 'file-upload.files'} %>
      <%= form.label :files, 'Choose Files', for: 'customFile', class: 'custom-file-label' %>
    </div>
  </div>
</div>
```

**app/views/posts/_preview_file_attachment.html.erb** 파일을 생성하고 아래와 같이 작성한다. 

```erb
<% if post.files.attached? %>
  <div>첨부된 파일(<%= post.files.size %>) :</div>
  <% post.files.each do |file| %>
    <% if file.content_type.include? 'image' %>
      <div class='file-thumbnail'>
          <% if file.content_type.include? 'image'%>
            <%= link_to image_tag(file.variant(resize_to_fill: [100, 100]), class: 'img-fluid rounded'), file, data: { fancybox: 'gallery', caption: file.filename }  %>
          <% else %>
              <%= link_to image_tag(file.preview(resize_to_fill: [100, 100]), class: 'img-fluid rounded'), file  %>
          <% end %>
          <%= link_to fa_icon(:solid, 'trash'), delete_post_file_attachment_path(post.id, file.blob_id),
                method: :delete,
                remote: true,
                data: { confirm: 'Are you sure?' },
                class: 'text-danger',
                style: 'position: absolute; top: 0; right: 0; margin-right: 4px;' %>
      </div>
    <% end %>
  <% end %>
  <ul class="list-group mt-2">
    <% post.files.each do |file| %>
      <% unless file.content_type.include? 'image' %>
        <li class="list-group-item">
          <%= fa_icon(:solid, 'download') %> <%= link_to file.filename, file %>
          <%= link_to fa_icon(:solid, 'trash'), delete_post_file_attachment_path(post.id, file.blob_id),
                  method: :delete,
                  remote: true,
                  data: { confirm: 'Are you sure?' },
                  class: 'text-danger' %>
        </li>
      <% end %>
    <% end %>
  </ul>
<% end %>
```

**Font Awesome** 을 사용하기 위해 아래와 같이 명령을 실행한다.

```bash
$ yarn add @fortawesome/fontawesome-free
```

**app/javascript/stylesheets/application.scss** 파일을 열고 아래와 같이 추가한다.

```scss
@import 'bootstrap/dist/css/bootstrap.min.css';

$fa-font-path: '~@fortawesome/fontawesome-free/webfonts'; 
@import '~@fortawesome/fontawesome-free/scss/fontawesome';
@import '~@fortawesome/fontawesome-free/scss/solid';
@import '~@fortawesome/fontawesome-free/scss/regular';
```

**Font Awesome** 사용시 도움이 될 수 있게 헬퍼를 추가한다. **app/helpers/application_helper.rb** 파일을 열고 아래의 내용을 추가한다. 

```ruby
module ApplicationHelper
  STYLES = {
    regular: 'r',
    solid: 's',
    brands: 'b',
    light: 'l',
    duotone: 'd'
  }.freeze

  def fa_icon(style, fontname)
    content_tag(:i, '', class: "fa#{STYLES[style]} fa-#{fontname}")
  end
end  
```

첨부된 파일을 삭제할 수 있도록 **posts_controller.rb** 파일 아래와 같이 액션 메소드를 추가한다. 

```ruby
class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy, :delete_file_attachment]

  def delete_file_attachment
    attached_file = ActiveStorage::Attachment.find_by blob_id: params[:blob_id]
    attached_file.purge_later
    # redirect_back(fallback_location: @admin_note)
    respond_to do |format|
      format.js
    end
  end
  
  private 
  ···
end  
```

**format.js** 에 해당하는 **app/views/posts/delete_file_attachment.js.erb** 파일을 아래와 같이 작성합니다. 

```erb
$("#preview_file_attachments").html("<%=j render 'preview_file_attachment', post: @post %>")
```

**config/routes.rb** 파일을 열고 이 액션을 위한 경로를 추가한다. 

```ruby
delete 'posts/:id/file_attachments/:blob_id', to: 'posts#delete_file_attachment', as: :delete_post_file_attachment
```

**app/javascript/stylesheets/styles.scss** 파일을 생성하고 아래와 같이 **CSS** 용 클래스를 추가한다.

```scss
.file-thumbnail {
  display:inline-block;
  position: relative;
  width:100px;
  height:100px;
  margin: 3px;
}
```

**app/javascript/stylesheets/application.scss** 파일을 열고 이 파일을 **import** 한다. 

```scss
···
@import './styles.scss';
```

![2019-12-14_14-11-41-6300463](/app/assets/images/readme/2019-12-14_14-11-41-6300463.png)

휴지통 아이콘을 클릭하여 첨부파일이 삭제되는 것을 확인한다. 

그러나 아래와 같은 오류가 발생할 것이다. 

![2019-12-14_16-05-05](/app/assets/images/readme/2019-12-14_16-05-05.png)

이 오류는 global 영역의 $ 가 정의되지 않아서 발생하는 오류이므로 app/javascript/application.js 파일을 열고 아래의 코드라인을 추가한다. 

```javascript
global.$ = require('jquery')
```

이제 오류없이 첨부파일이 삭제될 것이다. 

에디터에 삽입한 파일들의 썸네일을 표시하는 부분도 파셜 템플릿(**app/views/posts/_preview_embeds.html.erb**)으로 리팩토링하면, 

```erb

<% if post.content.embeds.size.positive? %>
  <div>삽입된 파일(<%= post.content.embeds.size %>) :</div>
  <% post.content.embeds.each do |file| %>
    <% if file.representable? %>
      <div style="display:inline-block;position: relative;width:100px;height:100px;margin: 3px;">
        <% if file.content_type.include? 'image'%>
          <%= link_to image_tag(file.variant(resize_to_fill: [100, 100]), class: 'img-fluid rounded'), file, download: true, class: 'border border-primary d-inline-block rounded' %>
        <% else %>
            <%= link_to image_tag(file.preview(resize_to_fill: [100, 100]), class: 'img-fluid rounded'), file, download: true, class: 'border border-primary d-inline-block rounded' %>
        <% end %>
      </div>
    <% else %>
      <%= link_to file.filename, file, download: true, class: 'btn btn-secondary' %>
    <% end %>
  <% end %>
<% end %>
```

**app/views/posts/show.html.erb** 뷰 파일은 다음과 같이 업데이드한다. 

```erb
···
<div id="preview_file_attachments" class='my-3' data-controller='fancybox'>
  <%= render 'preview_embeds', post: @post %>
</div>

<div id="preview_file_attachments" class='my-3' data-controller='fancybox'>
  <%= render 'preview_file_attachment', post: @post %>
</div>
···
```

지금까지 레일스 6에서 글 작성하기와 첨부파일 업로드하는 방법을 실제 프로젝트를 진행하면서 알아 보았습니다. 

감사합니다. 


