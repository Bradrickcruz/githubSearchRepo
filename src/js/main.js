import api from './api';

class App {
  constructor() {
    const localRepositoryList = JSON.parse(
      localStorage.getItem('repositories')
    );
    if (!localRepositoryList) {
      this.repositories = [];
    } else {
      this.repositories = localRepositoryList;
    }

    this.formElement = document.getElementById('repoForm');
    this.listElement = document.getElementById('repoList');
    this.inputElement = this.formElement.querySelector('#repoInput');

    this.registerEventHandlers();
    this.render();
  }
  registerEventHandlers() {
    this.formElement.addEventListener('submit', (event) =>
      this.addRepository(event)
    );
  }

  setLoading(show = true) {
    if (show) {
      this.formElement.innerHTML += `<span id="loading">Carregando...</span>`;
    } else {
      document.querySelector('#loading').remove();
    }
  }

  async addRepository(e) {
    e.preventDefault();

    const searchForRepository = this.inputElement.value;
    if (searchForRepository.length == 0) {
      return;
    }
    this.setLoading();
    try {
      const response = await api.get(`/repos/${searchForRepository}`);
      const {
        name,
        description,
        owner: { avatar_url },
        html_url,
      } = response.data;

      this.repositories.push({
        name,
        description,
        avatar_url: `${avatar_url}&s=80`,
        html_url,
      });
      this.saveOnLocalStorage();
      this.render();
    } catch (err) {
      alert(err.message);
    }
    this.resetInput();
    this.setLoading(false);
  }

  resetInput() {
    this.inputElement.value = '';
    this.inputElement = this.formElement.querySelector('#repoInput');
  }

  render() {
    this.listElement.innerHTML = '';
    let allRepositoriesHTML = this.repositories
      .map((repository) => {
        let imgElement = `<img src="${repository.avatar_url}"/>`;
        let titleElement = `<strong>${repository.name}</strong>`;
        let descriptionElement = `<p>${repository.description}</p>`;
        let referenceElement = `<a target="_blank" href="${repository.html_url}">Acessar</a>`;

        let liElement = `<li>
          ${imgElement}
          ${titleElement}
          ${descriptionElement}
          ${referenceElement}
          </li>`;
        return liElement;
      })
      .join('');

    this.listElement.innerHTML = allRepositoriesHTML;
  }
  saveOnLocalStorage() {
    localStorage.setItem('repositories', JSON.stringify(this.repositories));
  }
}
const app = new App();
