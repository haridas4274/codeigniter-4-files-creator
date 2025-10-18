# 🚀 CodeIgniter 4 Files Creator Extension Pack

**Creating CodeIgniter 4 project files has never been this easy!**  
This extension helps you instantly generate **Controllers**, **Models**, **Views**, **Services**, and **Routes** directly inside VS Code — no boilerplate,

---

## 🧩 Features

✅ **Generate Files Instantly**
- Create Controllers, Models, Views, and Services with predefined templates.
- Automatically create nested folders based on your input (e.g., `Admin/User` → `app/Controllers/Admin/User.php`).

✅ **Route Generator**
- Quickly add REST routes (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) into your CI4 route file.
- Automatically creates route groups and prefixes if the same group already exists.

✅ **Ctrl + Click View Navigation**
- In your controller, hold `Ctrl` (or `Cmd` on Mac) and click on the view path:
```php
return view('posts/index');
```
→ It opens or auto-creates `app/Views/posts/index.php`.

✅ **Custom Templates**
- Define your own file structure, author name, and route file path using VS Code settings.

✅ **Resource Controller Generator**
- Quickly generate RESTful controllers with built-in methods:  
  `index`, `create`, `store`, `edit`, `update`, `show`, `destroy`.

---

## ⚙️ Installation

1. Open **VS Code**.
2. Press **Ctrl + P** → run:
```
ext install codeigniter-4-files-creator
```
3. Or manually install from your local build:
- Run `npm install && npm run compile`
- Press `F5` to start the extension in a new VS Code window.

---

## 🧠 Usage

Use the **Command Palette** (`Ctrl + Shift + P` or `Cmd + Shift + P` on macOS)  
and type one of the following commands:

| Command | Description |
|----------|-------------|
| **CI4: Make View File** | Create a new view file in `app/Views`. |
| **CI4: Make Model File** | Create a model class with namespace `App\Models`. |
| **CI4: Make Controller File** | Generate a standard CI4 controller file. |
| **CI4: Make Controller – All (Resource)** | Generate a REST controller with all basic methods. |
| **CI4: Make Service** | Create a new service class inside `app/Services`. |
| **CI4: Route GET / POST / PUT / DELETE / PATCH** | Add a new route definition in your configured `Routes.php` file. |

---

## ⚙️ Extension Settings

You can modify these from  
`File → Preferences → Settings → Extensions → CodeIgniter 4 Files Creator`.

| Setting | Default | Description |
|----------|----------|-------------|
| `ci4FilesCreator.enableViewNavigation` | `true` | Enable Ctrl + Click navigation for `view()` in controllers. |
| `ci4FilesCreator.fileExtension` | `.php` | Default extension for generated files. |
| `ci4FilesCreator.defaultFolder` | `app/Views` | Base folder for view files. |
| `ci4FilesCreator.viewTemplate` | `<h1>Hello, CodeIgniter 4!</h1>` | Default content for new view files. |
| `ci4FilesCreator.authorName` | `Your Name` | Author name added to generated files. |
| `ci4FilesCreator.controllerTemplate` | `<?php namespace App\Controllers; ?>` | Initial content for new controllers. |
| `ci4FilesCreator.routeFile` | `app/Config/Routes.php` | Default route file path. |

---

## 🧰 Example Workflows

### 🧩 Create a Model
- Run `CI4: Make Model File`
- Enter: `blog/Post`
- Generates:
```
app/Models/Blog/PostModel.php
```

### 🎨 Create a View
- Run `CI4: Make View File`
- Enter: `blog/post`
- Generates:
```
app/Views/blog/post.php
```

### 🧠 Create Resource Controller
- Run `CI4: Make Controller – All (Resource)`
- Enter: `Blog/Post`
- Generates:
```
app/Controllers/Blog/Post.php
```
with predefined methods:
- index()
- create()
- store()
- show()
- edit()
- update()
- destroy()

### 🔗 Add a Route
- Run `CI4: Route POST`
- Enter route path and controller
- Automatically appends a route in your `Routes.php` (or configured file).

---

**Activate Events:**  
The extension activates when you run any `make.ci4_*` command.

---

## 🧩 Contribution

Pull requests are welcome!  
If you find a bug or have suggestions, open an issue or submit a PR.

---

## 🧾 License

MIT License © 2025 Haridas

---

### 💡 Quick Tip
After installing, you can right-click your `app` folder and run:
```
> CI4: Make Controller File
```
to quickly scaffold a controller with namespaces and view linkage.
