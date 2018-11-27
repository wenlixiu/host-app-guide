echo '开始clone文档分支'

node_modules/.bin/gitbook build

git checkout gh-pages

cp -R _book/* .

git add .

git commit -m 'deploy host-app docs'

git push origin gh-pages

git checkout master
