glance
======

所有前端的檔案都放在`/app/`
下面的相對位置都是以/app為根目錄標示的

* flask template: `template/`
* flask statistic file `statistic/`

# /template/index.html
最小單位的區塊長這樣
其中`col-lg-12`代表在大螢幕裝置上這個區塊的寬度就是12個單位, 以glance來說就是單欄顯示
最裡面的div就是裝每個module的地方, 可以用底下的`loadTemplate`把資料裝進去


    <div class="row marketing plot-module">
        <div class="col-lg-12">
            <h4>Definition</h4>
            <div id="wordDefinition">

            </div>

        </div>
    </div>







# /scripts/main.js

所有的js檔都先放在這裡面

## Functions

### fetchData( qWord )

user輸入一個字之後, 會啟動這隻function
所以只要把你寫好的function在這隻call就好了




### loadTemplate( templateName, data, entry )

這個檔案會讀取template檔(語法是用鬍子先生mustache, 底層是handlebar), 然後把render好的html檔讀到entry裡面

**template path**
    
記得要把template擺在

    /hb-tempate/<template name>    

並且副檔名是`.tpl`
templateName這個參數就是傳`.tpl`之前的檔案名稱(不包括副檔名)
    
鬍子先生的語法可以參考

[handlebar.js](http://handlebarsjs.com/)












> Written with [StackEdit](https://stackedit.io/).

