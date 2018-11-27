echo '开始clone文档分支'

node_modules/.bin/gitbook build

git checkout gh-pages

cp -R _book/* .

git add .

git commit -m 'deploy access doc'

git push origin gh-pages

#git clone https://github.com/swan-team/host-app-guide.git ./docs

# cd ./docs
# 
# git checkout gh-pages
# 
# cd ../
# 
# echo '开始编译'
# 
# node_modules/.bin/gitbook build ./root ./docs
# 
# cd ./docs
# 
# git add .
# 
# git commit -m 'deploy host-app docs'
# 
# git push origin gh-pages
