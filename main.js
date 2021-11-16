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
  const photos = feed.card__photo;
  let imgHtml = '';
  let dotBtnHtml = '';
  let arrowBtnHtml = '';
  if (photos.length >= 2) {
    arrowBtnHtml = `<div class="feed__arrow-btn__box right feed__btn__box__${feedUser.num}">
      <button class="feed__arrow-button hidden feed__prev feed__prev__btn__${feedUser.num}">
        <i class="fas fa-arrow-circle-left feed_prev_icon__${feedUser.num}" data-key="prev" data-num="${feedUser.num}"></i>
      </button>
      <button class="feed__arrow-button feed__next feed__next__btn__${feedUser.num}">
        <i class="fas fa-arrow-circle-right feed__next__icon__${feedUser.num}" data-key="next" data-num="${feedUser.num}"></i>
      </button>
    </div>`;
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (i === 0) {
        dotBtnHtml += `<button class="icon__dot fas fa-circle dot__btn__${feedUser.num}-${i} icon__dot__blue"></button>`;
      } else {
        dotBtnHtml += `<button class="icon__dot fas fa-circle dot__btn__${feedUser.num}-${i}"></button>`;
      }
      imgHtml += `<div class="card__photo__inner" style="width:100%" data-photoNum="${i}"> <img src="${photo}" alt="" /> </div>`;
    }
  } else {
    imgHtml = `<div class="card__photo__inner" style="width:100%"> <img src="${photos[0]}" alt=""/> </div>`;
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
  return `<article class="contents__feed__card card__${feedUser.num}">
    <div class="card__info">
      <div class="card__info__profile">
        <img class="profile__img" src="${feedUser.profile__img}" alt="" />
        <p href="" class="profile__name">${feedUser.profile__name}</p>
      </div>
      <i class="card__info__more-btn fas fa-ellipsis-h"></i>
    </div>
    <div class="card__photo__container" data-container="${feedUser.num}">     
    ${arrowBtnHtml}
      <div class="card__photo card__photo__${feedUser.num}" data-length="${feed.card__photo.length}" style="width: ${feed.card__photo.length}00%"> 
      ${imgHtml}
      </div>
    </div>
    <div class="card__icons">
      <div class="icons__left">
      <button
      class="feed_icon icon__heart far fa-heart"
      data-shape="heart"
      data-detail="empty__heart"
    ></button>
    <button
      class="feed_icon icon__heart full hidden fas fa-heart"
      data-shape="heart"
      data-detail="full__heart"
    ></button>
    <button
      class="feed_icon icon__comment far fa-comment"
      data-shape="comment"
    ></button>
    <button
      class="feed_icon icon__share far fa-paper-plane"
      data-shape="plane"
    ></button>
      </div>
      <button
      class="feed_icon icon__bookmark far fa-bookmark"
      data-shape="bookmark"
      data-detail="empty__bookmark"
    ></button>
    <button
      class="feed_icon icon__bookmark full hidden fas fa-bookmark"
      data-shape="bookmark"
      data-detail="full__bookmark"
    ></button>
      <div class="icons__middle">
        ${dotBtnHtml}  
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
  const story = storyUsers.story.story__src;

  return `<li><img class="contents__story__profile story__${storyUsers.num}" src="${storyUsers.profile__img}" data-src="${story}" /></li>`;
}

const feedBtnMap = new Map();
function feedArrowBtnEvent() {
  const btns = document.querySelectorAll('.feed__arrow-button');
  let feedOrder = 1;

  const moveFeed = (event) => {
    const direction = event.target.dataset.key;
    if (direction == null) {
      return;
    }
    const feedNum = event.target.dataset.num;
    const feedBtnBox = document.querySelector(`.feed__btn__box__${feedNum}`);
    const prevBtn = document.querySelector(`.feed__prev__btn__${feedNum}`);
    const nextBtn = document.querySelector(`.feed__next__btn__${feedNum}`);
    if (!feedBtnMap.has(feedNum)) {
      feedBtnMap.set(feedNum, { now: feedOrder, prev: 1 });
    }
    feedOrder = feedBtnMap.get(feedNum).now;
    const photoWidth = document.querySelector(
      '.card__photo__inner'
    ).offsetWidth;

    const photos = document.querySelector(`.card__photo__${feedNum}`);
    const total = parseInt(photos.dataset.length);
    if (direction === 'next') {
      // const dot = document.querySelector(
      //   `.dot__btn__${feedNum}-${feedOrder}`
      // );

      // dot.classList.add('icon__dot__blue');
      feedBtnBox.classList.remove('right');
      prevBtn.classList.remove('hidden');
      const position = feedOrder * parseInt(photoWidth);
      photos.style.transform = `translateX(-${position}px)`;
      feedBtnMap.set(feedNum, { now: feedOrder + 1, prev: feedOrder });
      if (parseInt(total) === feedOrder + 1) {
        nextBtn.classList.add('hidden');
      }
    } else {
      if (feedOrder === total) {
        nextBtn.classList.remove('hidden');
      }
      // const dot = document.querySelector(
      //   `.dot__btn__${feedNum}-${feedOrder - 2}`
      // );
      // dot.classList.add('icon__dot__blue');
      const position = (feedOrder - 2) * parseInt(photoWidth);
      photos.style.transform = `translateX(-${position}px)`;
      feedBtnMap.set(feedNum, { now: feedOrder - 1, prev: feedOrder });
      if (feedOrder - 1 === 1) {
        prevBtn.classList.add('hidden');
        feedBtnBox.classList.add('right');
      }
    }

    const order = feedBtnMap.get(feedNum);
    const nowDot = document.querySelector(
      `.dot__btn__${feedNum}-${order.now - 1}`
    );
    nowDot.classList.add('icon__dot__blue');
    const prevDot = document.querySelector(
      `.dot__btn__${feedNum}-${order.prev - 1}`
    );
    prevDot.classList.remove('icon__dot__blue');
  };

  for (let btn of btns) {
    btn.addEventListener('click', (event) => moveFeed(event));
  }
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

function storyModalEvent() {
  const storyBtns = document.querySelectorAll('.contents__story__profile');
  for (let storyBtn of storyBtns) {
    storyBtn.addEventListener('click', (event) => {
      popupStory(event);
      document.body.classList.add('noScroll');
    });
  }
}

function popupStory(event) {
  const target = event.target;
  const storySrc = target.dataset.src;
  const popup = document.querySelector('.popup');
  popup.classList.remove('hidden');

  const popupContents = document.querySelector('.popup__story__content__box');
  //<img src="img/fubao.png" alt="">
  popupContents.innerHTML = `<img class="popup__story__content" src="${storySrc}" alt="">`;

  const closeBtn = document.querySelector('.popup__close__btn');
  closeBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
    document.body.classList.remove('noScroll');
  });

  const popupLogo = document.querySelector('.popup__logo');
  popupLogo.addEventListener('click', () => {
    popup.classList.add('hidden');
  });
}

const searchCover = document.querySelector('.navbar__search__cover');
searchCover.addEventListener('click', () => {
  searchCover.classList.add('hidden');
  document.querySelector('.navbar__search__input').focus();
});

function findingFeed(type, value, users) {
  const hiddenFeed = (hidenFeedNums) => {
    for (let num of hidenFeedNums) {
      document.querySelector(`.card__${num}`).classList.add('hidden');
    }
  };
  const feeds = document.querySelectorAll('.contents__feed__card');
  for (let feed of feeds) {
    if (feed.classList.contains('hidden')) {
      feed.classList.remove('hidden');
    }
  }
  //tag로 feed 찾기
  if (type === 'tag') {
    const hidenFeedNums = [];
    for (let user of users) {
      if (user.feed) {
        if (user.feed.tags) {
          const tags = user.feed.tags;
          if (!tags.includes(value)) {
            hidenFeedNums.push(user.num);
          }
        }
      }
    }
    // hiddenFeed(hidenFeedNums);
    for (let num of hidenFeedNums) {
      document.querySelector(`.card__${num}`).classList.add('hidden');
    }
  }

  //id로 feed 찾기
  if (type === 'id') {
    const hidenFeedNums = [];
    for (let user of users) {
      if (user.feed) {
        if (user.profile__name !== value) {
          hidenFeedNums.push(user.num);
        }
      }
    }
    for (let num of hidenFeedNums) {
      document.querySelector(`.card__${num}`).classList.add('hidden');
    }
  }
}

function enterKey(event, users) {
  if (event.key === 'Enter') {
    let inputValue = event.target.value;
    let value;
    let type;
    if (inputValue[0] === '#') {
      type = 'tag';
      value = inputValue.slice(1, inputValue.length);
    } else {
      type = 'id';
      value = inputValue;
    }
    findingFeed(type, value, users);
  }
}

function addEvent(users) {
  addMoreBtnEvent();
  addStoryBtnEvent();
  feedBtnEvent();
  feedArrowBtnEvent();
  storyModalEvent();
  document
    .querySelector('.navbar__search__input')
    .addEventListener('keydown', (event) => enterKey(event, users));
}

loadUsers()
  .then((users) => {
    displayInfo(users);
    addEvent(users);
  })
  .catch(console.log);
