#!/usr/bin/env node
const chalk = require('chalk')
console.log('Hello, cli!')
const fs = require('fs')
const program = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const ora = require('ora')
const symbols = require('log-symbols')
const handlebars = require('handlebars')
program
  .version(require('./package').version, '-v, --version')
  .command('init <name>')
  .action(name => {
    console.log(name)
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'author',
          message: '请输入你的名字'
        }
      ])
      .then(answers => {
        console.log(answers.author)
        const lqProcess = ora('正在创建...')
        lqProcess.start()
        download(
          'direct:https://github.com/Chant-Lee/rick-cli-templates1.git',
          name,
          { clone: true },
          err => {
            if (err) {
              lqProcess.fail()
              console.log(symbols.error, chalk.red(err))
            } else {
              lqProcess.succeed()
              const fileName = `${name}/package.json`
              const meta = {
                name,
                author: answers.author
              }
              if (fs.existsSync(fileName)) {
                const content = fs.readFileSync(fileName).toString()
                const result = handlebars.compile(content)(meta)
                fs.writeFileSync(fileName, result)
              }
              console.log(symbols.success, chalk.green('创建成功'))
            }
          }
        )
      })
  })
program.parse(process.argv)
