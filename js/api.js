const Url = {
  SERVER: 'https://23.javascript.pages.academy/code-and-magick',
  DATA: 'https://23.javascript.pages.academy/code-and-magick/data',
};

const getData = (onSuccess) => {
  fetch(Url.DATA)
    .then((response) => response.json())
    .then((wizards) => {
      onSuccess(wizards);
    });
};

const sendData = (onSuccess, onFail, body) => {
  fetch(
    Url.SERVER,
    {
      method: 'POST',
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail('Не удалось отправить форму. Попробуйте ещё раз');
      }
    })
    .catch(() => {
      onFail('Не удалось отправить форму. Попробуйте ещё раз');
    });
};

export {getData, sendData};
