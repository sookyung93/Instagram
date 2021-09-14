'use strict';

function loadUsers() {
  return fetch('data/data.json') //
    .then((response) => response.json())
    .then((json) => json.users);
}

function displayInfo(users) {
  const feedUsers = users.filter((user) => user.feed);
  displayFeeds(feedUsers);
  const storyUsers = users.filter((user) => user.story);
  displayStroy(storyUsers);
}

function displayFeeds(feedUsers) {
  const container = document.querySelector('.contents__feed');
  container.innerHTML = feedUsers
    .map((feedUser) => createFeedHtmlString(feedUser))
    .join('');
}

function createFeedHtmlString(feedUser) {
  const feed = feedUser.feed;
  const text = feed.comment__text;
  let textHTMl;
  if (text.length > 1) {
    let hiddenText = '';
    for (let i = 1; i < text.length; i++) {
      hiddenText += `<br/>${text[i]}`;
    }
    textHTMl = `${text[0]}<span class="comment__text hidden" id="btn__text${feedUser.num}">${hiddenText}</span
    ><span class="btn__more btn__more${feedUser.num}" data-key="${feedUser.num}">... 더보기<span>`;
  } else {
    textHTMl = text;
  }

  return `<article class="contents__feed__card">
    <div class="card__info">
      <div class="card__info__profile">
        <img class="profile__img" src="${feedUser.profile__img}" alt="" />
        <p href="" class="profile__name">${feedUser.profile__name}</p>
      </div>
      <i class="card__info__more-btn fas fa-ellipsis-h"></i>
    </div>
    <div class="card__photo">
      <img src="${feed.card__photo}" alt="" />
    </div>
    <div class="card__icons">
      <div class="icons__left">
        <i class="icon__heart far fa-heart"></i>
        <i class="icon__heart full fas fa-heart"></i>
        <i class="icon__comment far fa-comment"></i>
        <i class="icon__share far fa-paper-plane"></i>
      </div>
      <i class="icon__bookmark far fa-bookmark"></i>
      <div class="icons__middle">
        <i class="icon__dote fas fa-circle"></i>
      </div>
    </div>
    <div class="card__bottom">
      <p class="bottom__like">
        <span class="bottom__like__id">${feed.bottom__like__id}</span>님 외
        <span class="bottom__like__count">여러명</span>이 좋아합니다.
      </p>
      <div class="bottom__comment">
        <span class="comment__id">${feed.profile__name}</span>
        <span class="comment__text"
          >${textHTMl}</span
        >
      </div>
      <div class="bottom__reply">
        <p class="reply">
          <span class="reply__id">zzang2</span
          ><span class="reply__comment">귀여워</span>
        </p>
        <p class="reply">
          <span class="reply__id">zzang3</span
          ><span class="reply__comment">귀여워</span>
        </p>
        <p class="reply">
          <span class="reply__id">zzang4</span
          ><span class="reply__comment">귀여워</span>
        </p>
      </div>
      <div class="bottom__write-box">
        <div class="write-box__left">
          <i class="left__icon far fa-smile"></i>
          <textarea
            class="left__input"
            placeholder="댓글 달기"
            name=""
            id=""
            rows="1"
          ></textarea>
        </div>
        <button class="write-box__right">게시</button>
      </div>
    </div>
  </article>`;
}

function displayStroy(storyUsers) {
  const container = document.querySelector('.contents__story');
  container.innerHTML = storyUsers
    .map((storyUsers) => createStoryHtmlString(storyUsers))
    .join('');

  addStoryBtnEvent();
}

function createStoryHtmlString(storyUsers) {
  const story = storyUsers.story;

  return `<li><img class="contents__story__profile" src="${storyUsers.profile__img}" alt="" /></li>`;
}

function addStoryBtnEvent() {
  const netxBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');

  const btns = document.querySelectorAll('.contents__story__button');

  let position = 0;
  const storyProfileWidth = document
    .querySelector('.contents__story__profile')
    .getBoundingClientRect().width;
  const story = document.querySelector('.contents__story');
  let storyOffsetWidth = document.querySelector(
    '.contents__story__box'
  ).offsetWidth;
  const storyScrollWidth = document.querySelector(
    '.contents__story__box'
  ).scrollWidth;
  const setUpOffsetWidth = storyOffsetWidth;

  let margin = window.getComputedStyle(
    document.querySelector('.contents__story__profile')
  ).marginLeft;

  margin = parseInt(margin.slice(0, margin.length - 2));

  const moveStory = (e) => {
    const direction = e.target.dataset.key;

    if (direction === 'next') {
      position += margin + storyProfileWidth;
      prevBtn.classList.remove('hidden');
      if (storyOffsetWidth < storyScrollWidth) {
        storyOffsetWidth += margin + storyProfileWidth;
        story.style.transition = 'transform 0.7s';
        story.style.transform = `translateX(-${position}px)`;
        if (storyOffsetWidth >= storyScrollWidth) {
          netxBtn.classList.add('hidden');
        }
      }
    } else {
      position -= margin + storyProfileWidth;
      netxBtn.classList.remove('hidden');
      if (storyOffsetWidth > setUpOffsetWidth) {
        storyOffsetWidth -= margin + storyProfileWidth;
        story.style.transition = 'transform 0.7s';
        story.style.transform = `translateX(-${position}px)`;
        if (storyOffsetWidth <= setUpOffsetWidth) {
          prevBtn.classList.add('hidden');
        }
      }
    }
  };

  for (let btn of btns) {
    btn.addEventListener('click', (event) => moveStory(event));
  }
}

function addMoreBtnEvent() {
  const btn = document.querySelectorAll('.btn__more');
  for (let i = 0; i < btn.length; i++) {
    btn[i].addEventListener('click', (event) => {
      const num = event.target.dataset.key;
      const hiddenText = document.querySelector(`#btn__text${num}`);
      hiddenText.classList.remove('hidden');
      const btn = document.querySelector(`.btn__more${num}`);
      btn.classList.add('hidden');
    });
  }
}

loadUsers()
  .then((users) => {
    displayInfo(users);
    addMoreBtnEvent();
  })
  .catch(console.log);
