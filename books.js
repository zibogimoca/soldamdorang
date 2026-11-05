// 책 정보가 확인되면 cover와 description을 추가합니다.
const books = [
  { title: '적당한 마음' },
  { title: '왼손잡이 고양이에게 허락은 필요 없지' },
  { title: '급류' },
  { title: '그랬다고 적었다' },
];
const list = document.querySelector('#book-list');
const dialog = document.querySelector('#book-dialog');
const details = document.querySelector('#book-details');
books.forEach((book, index) => {
  const button = document.createElement('button');
  button.className = 'book-card';
  const cover = document.createElement('span');
  cover.className = `cover cover-${index}`;
  cover.textContent = book.title;
  const title = document.createElement('strong');
  title.textContent = book.title;
  button.append(cover, title);
  button.addEventListener('click', () => {
    details.replaceChildren();
    const heading = document.createElement('h2');
    heading.textContent = book.title;
    const note = document.createElement('p');
    note.textContent = '실제 표지와 책 소개는 자료 확인 후 추가할 예정입니다.';
    details.append(heading, note);
    dialog.showModal();
  });
  list.append(button);
});
document.querySelector('.close').addEventListener('click', () => dialog.close());

