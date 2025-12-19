# RampX CLI ⚡

> **Ramp up your development workflow** - by Rampage

A powerful, beautiful CLI tool for scaffolding projects with modern architecture patterns. RampX helps you start new projects instantly with best practices baked in.

[![npm version](https://img.shields.io/npm/v/rampx-cli.svg)](https://www.npmjs.com/package/rampx-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **Instant Project Setup** - Create production-ready projects in seconds
- 🏗️ **Architecture Patterns** - Choose from multiple proven patterns
- 🎨 **Beautiful CLI** - Gradient ASCII art, colors, and smooth interactions
- 📚 **Educational** - Learn best practices through smart defaults
- ⚡ **Fast & Offline** - Templates work without internet
- 🔧 **Flexible** - Skip steps with flags, or go interactive
- 🎯 **Multi-Framework** - Node.js, Laravel, Flutter support

## 🎬 Demo

```bash
$ rpx init node my-api

██████╗  █████╗ ███╗   ███╗██████╗ ██╗  ██╗
██╔══██╗██╔══██╗████╗ ████║██╔══██╗╚██╗██╔╝
██████╔╝███████║██╔████╔██║██████╔╝ ╚███╔╝ 
██╔══██╗██╔══██║██║╚██╔╝██║██╔═══╝  ██╔██╗ 
██║  ██║██║  ██║██║ ╚═╝ ██║██║     ██╔╝ ██╗
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝     ╚═╝  ╚═╝
                  by Rampage ⚡

    Ramp up your development workflow

📐 Choose Project Structure

? Select a project structure pattern:
  ❯ Modular ─ Module-based organization for medium projects ⭐ RECOMMENDED
    Simple ─ Flat structure for small projects and APIs
    Clean Architecture ─ Layered architecture with dependency inversion

✓ Project structure created
✓ Git initialized
✓ Dependencies installed

╭──────────────────────────────────────────────────╮
│                                                  │
│   ✨ Project created successfully!              │
│                                                  │
│   Project: my-api                                │
│   Type: node                                     │
│   Pattern: modular                               │
│                                                  │
│   🚀 Next steps:                                 │
│                                                  │
│     cd my-api                                    │
│     npm run dev                                  │
│                                                  │
╰──────────────────────────────────────────────────╯
```

## 📦 Installation

```bash
npm install -g rampx-cli
```

Or use directly with npx:

```bash
npx rampx-cli init node my-project
```

## 🚀 Quick Start

### Create a new project

```bash
# Interactive mode (recommended for beginners)
rpx init node my-api

# With pattern selection
rpx init flutter my-app --pattern=clean

# Skip all prompts
rpx init laravel my-app --yes

# Full control
rpx init node backend --pattern=modular --no-git --no-install
```

### List available patterns

```bash
rpx patterns node
rpx patterns flutter
rpx patterns laravel
```

### Get help

```bash
rpx --help
rpx init --help
```

## 🏗️ Architecture Patterns

### Node.js

| Pattern | Description | Use Case |
|---------|-------------|----------|
| **Simple** | Flat structure with basic folders | Small APIs, microservices |
| **Modular** ⭐ | Feature-based modules | Medium to large applications |
| **Clean** | Clean Architecture with DI | Enterprise applications |

### Laravel

| Pattern | Description | Use Case |
|---------|-------------|----------|
| **Standard** | Traditional MVC structure | Small to medium apps |
| **Feature** ⭐ | Feature-based organization | Scalable applications |
| **DDD** | Domain-Driven Design | Complex business logic |

### Flutter

| Pattern | Description | Use Case |
|---------|-------------|----------|
| **Layered** | Presentation/Domain/Data layers | Standard mobile apps |
| **Feature** ⭐ | Feature-first approach | Modular applications |
| **Clean** | Clean Architecture with BLoC | Large-scale apps |

⭐ = Recommended pattern for most projects

## 📖 Usage Examples

### Node.js API

```bash
# Create a modular Node.js API
rpx init node my-api --pattern=modular

cd my-api
npm run dev
```

**Generated structure:**
```
my-api/
├── src/
│   ├── modules/
│   │   └── users/
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── models/
│   │       └── routes/
│   ├── shared/
│   │   ├── middleware/
│   │   └── utils/
│   └── index.js
├── tests/
├── package.json
└── README.md
```

### Flutter App

```bash
# Create a feature-first Flutter app
rpx init flutter todo-app --pattern=feature

cd todo-app
flutter run
```

**Generated structure:**
```
todo-app/
├── lib/
│   ├── features/
│   │   ├── auth/
│   │   └── home/
│   ├── core/
│   │   ├── theme/
│   │   └── utils/
│   └── main.dart
├── test/
└── pubspec.yaml
```

### Laravel Application

```bash
# Create a DDD Laravel app
rpx init laravel crm --pattern=ddd

cd crm
php artisan serve
```

**Generated structure:**
```
crm/
├── src/
│   ├── Domain/
│   │   └── User/
│   │       ├── Entities/
│   │       ├── Repositories/
│   │       └── Services/
│   ├── Application/
│   │   └── UseCases/
│   ├── Infrastructure/
│   └── Presentation/
├── app/
├── config/
└── composer.json
```

## ⚙️ Command Reference

### `rpx init <type> <name> [options]`

Create a new project.

**Arguments:**
- `<type>` - Project type: `node`, `laravel`, or `flutter`
- `<name>` - Project name (lowercase, numbers, hyphens, underscores)

**Options:**
- `--pattern <pattern>` - Choose architecture pattern
- `--no-git` - Skip git initialization
- `--no-install` - Skip dependency installation
- `--yes` - Skip all prompts, use defaults

**Examples:**
```bash
rpx init node my-api
rpx init flutter app --pattern=clean
rpx init laravel crm --yes --no-git
```

### `rpx patterns <framework>`

List available patterns for a framework.

**Arguments:**
- `<framework>` - Framework name: `node`, `laravel`, or `flutter`

**Examples:**
```bash
rpx patterns node
rpx patterns flutter
```

### `rpx --version`

Show CLI version.

### `rpx --help`

Show help information.

## 🎨 What You Get

Every generated project includes:

- ✅ **Clean folder structure** based on chosen pattern
- ✅ **README.md** with setup instructions
- ✅ **Environment files** (.env, .env.example)
- ✅ **Git repository** (optional)
- ✅ **Dependencies installed** (optional)
- ✅ **Framework-specific config** (package.json, composer.json, pubspec.yaml)
- ✅ **Entry point files** ready to run
- ✅ **Best practices** baked in

## 🔧 Configuration

### Skip prompts with flags

```bash
# Skip git initialization
rpx init node api --no-git

# Skip dependency installation
rpx init node api --no-install

# Skip everything, use defaults
rpx init node api --yes
```

### Combine flags

```bash
rpx init node api --pattern=clean --no-git --no-install
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding New Patterns

To add a new pattern:

1. Add pattern definition in `commands/init/patterns.js`
2. Create template generator in `commands/init/templates.js`
3. (Optional) Add physical template files in `templates/`

### Adding New Frameworks

To add a new framework:

1. Add framework patterns in `patterns.js`
2. Create template generator function in `templates.js`
3. Update validation in `commands/init/index.js`

## 📝 Roadmap

### v0.2.0
- [ ] React and Vue.js support
- [ ] NestJS support
- [ ] Custom template URLs
- [ ] Config file support (`.rpxrc`)

### v0.3.0
- [ ] `rpx add` - Add features to existing projects
- [ ] `rpx generate` - Generate components/models
- [ ] Plugin system

### v0.4.0
- [ ] `rpx deploy` - Deployment helpers
- [ ] `rpx doctor` - Project health check
- [ ] Template marketplace

## 🐛 Known Issues

None at the moment! Report issues on GitHub.

## 📄 License

MIT © Rampage (Steve Divan EKANGOH)

## 🙏 Acknowledgments

Built with:
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Chalk](https://github.com/chalk/chalk) - Terminal colors
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [Ora](https://github.com/sindresorhus/ora) - Elegant spinners
- [Boxen](https://github.com/sindresorhus/boxen) - Terminal boxes
- [Figlet](https://github.com/patorjk/figlet.js) - ASCII art

## 📞 Support

- 📧 Email: rampage@example.com
- 🐦 Twitter: [@rampage_dev](https://twitter.com/rampage_dev)
- 💬 Discord: [Join our server](https://discord.gg/rampx)

## ⭐ Show Your Support

If you like RampX, give it a ⭐ on [GitHub](https://github.com/rampage/rampx-cli)!

---

<div align="center">

**Made with ❤️ by Rampage ⚡**

*Ramp up your development workflow*

</div>
