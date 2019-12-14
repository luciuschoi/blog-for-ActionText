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