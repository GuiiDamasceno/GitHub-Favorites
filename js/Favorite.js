import { GitUsers } from "./UsuarioGit.js"

export class Git {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usuário já cadastrado!')
            }

            const user = await GitUsers.search(username)

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class GitView extends Git {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
        this.save()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {
        this.removeAlltr()

        this.entries.forEach(user => {
            const row = this.createRow()
            console.log(row)

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Image de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/maykbrito.png" alt="Imagem de mayk brito">
                <a href="https://github.com/maykbrito" target="_blank">
                    <p>Mayk brito</p>
                    <span>maykbrito</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                9589
            </td>
            <td>
                <button class="remove">Remove</button>
            </td>
        `
        return tr
    }

    removeAlltr() {
        this.tbody = this.root.querySelector('table tbody')
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => tr.remove())
    }
}
