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
  let imgHtml = '';
  if (feed.card__photo.length >= 2) {
    for (let photo of feed.card__photo) {
      imgHtml += `<div class="card__photo__inner" style="width:100%"> <img src="${photo}" alt="" /> </div>`;
    }
  } else {
    imgHtml = `<div class="card__photo__inner" style="width:100%"> <img src="${feed.card__photo[0]}" alt=""/> </div>`;
  }

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
    <div class="card__photo__container">
      <div class="card__photo card${feedUser.num}"  style="width: ${feed.card__photo.length}00%">
        ${imgHtml}
      </div>
    </div>
    <div class="card__icons">
      <div class="icons__left">
        <button class="feed_icon icon__heart far fa-heart" data-shape="heart" data-detail="empty__heart"></button>
        <button class="feed_icon icon__heart full hidden fas fa-heart" data-shape="heart" data-detail="full__heart"></button>
        <button class="feed_icon icon__comment far fa-comment" data-shape="comment"></button>
        <button class="feed_icon icon__share far fa-paper-plane" data-shape="plane"></button>
      </div>
      <button class="feed_icon icon__bookmark far fa-bookmark" data-shape="bookmark" data-detail="empty__bookmark"></button>
      <button class="feed_icon icon__bookmark full hidden fas fa-bookmark" data-shape="bookmark" data-detail="full__bookmark"></button>
      <div class="icons__middle">
        <button class="icon__dote fas fa-circle" data-dotenum=${feedUser.num}></button>
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
        console.log(position);
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

function feedBtnEvent() {
  const btns = document.querySelectorAll('.feed_icon');

  for (let btn of btns) {
    btn.addEventListener('click', function (event) {
      const btnTarget = event.target;
      const shape = btnTarget.dataset.shape;
      const detail = btnTarget.dataset.detail;

      switch (shape) {
        case 'heart':
        case 'bookmark':
          const apearBtn =
            detail === `empty__${shape}` ? `full__${shape}` : `empty__${shape}`;
          btnTarget.classList.add('hidden');
          document
            .querySelector(`[data-detail="${apearBtn}"]`)
            .classList.remove('hidden');
          break;
      }
    });
  }
}

function feedDoteEvent() {
  const dotes = document.querySelectorAll('.icon__dote');
  console.log('data - num');
  // const photoWidth = document.querySelector(
  //   '.contents__story__box'
  // ).offsetWidth;
  const photoWidth = document.querySelector('.card__photo__inner').offsetWidth;
  console.log(photoWidth);

  for (let dote of dotes) {
    dote.addEventListener('click', function (event) {
      const feedNum = event.target.dataset.dotenum;
      console.log(feedNum);
      const photos = document.querySelector(`.card${feedNum}`);
      photos.style.transform = `translateX(-${photoWidth}px)`;
    });
  }
}

function addBtnEvent() {
  addMoreBtnEvent();
  addStoryBtnEvent();
  feedBtnEvent();
  feedDoteEvent();
}

loadUsers()
  .then((users) => {
    displayInfo(users);
    addBtnEvent();
  })
  .catch(console.log);
