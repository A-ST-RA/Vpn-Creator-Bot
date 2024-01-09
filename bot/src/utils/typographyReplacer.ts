import { parse } from 'node-html-parser';

export const typographyReplacer = (text: string) => {
  const htmlData = parse(text);

  htmlData.querySelectorAll('div[data-youtube-video]').forEach(video => {
    video.remove();
  });

  const numberedLists = htmlData.querySelectorAll('ol');
  const pinedLists = htmlData.querySelectorAll('ul');
  const links = htmlData.querySelectorAll('a');
  const paragraphs = htmlData.querySelectorAll('p');

  paragraphs.forEach(paragraph => {
    paragraph.removeAttribute('style');
  });
  
  links.forEach(link => {
    link.removeAttribute('target');
    link.removeAttribute('rel');
  });

  pinedLists.forEach(el => {
    el.childNodes.forEach(el => {
      el.textContent = `— ${el.text}`
    })
  });

  numberedLists.forEach(el => {
    el.childNodes.forEach((el, idx) => {
      el.textContent = `${idx+1}. ${el.text}`
    })
  });

  let data = htmlData.toString()
    .replace(/<p>/gm, '').replace(/<\/p>/gm, '\n')
    .replace(/<ul>/gm, '').replace(/<\/ul>/gm, '')
    .replace(/<ol>/gm, '').replace(/<\/ol>/gm, '')
    .replace(/<li>/gm, '').replace(/<\/li>/gm, '\n')
    .replace(/<img>.*<\/img>/gm, '')
    .replace(/<h[1-6]>/gm, '<strong>').replace(/<\/h[1-6]>/gm, '<\/strong>\n')
    .replace(/<span style=".*">/gm, '<span class="tg-spoiler">').replace(/<\/span *>/gm, '</span>')
    .replace(/<hr>/gm, '\n\n')
    .replace(/<br>/gm, '\n')
    .replace(/<(\/|)(table|tbody|tr|td|td colspan=".*" rowspan=".*")>/gm, '');

  return data;
}