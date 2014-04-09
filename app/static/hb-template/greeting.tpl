<header class="row" id="header-banner-wrap">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-6">
        <!-- top menu button -->
        <div class="menu-btn-wrap" id="menu-controler">
            <div class="menu-btn">
                <div class="menu-btn-bar"></div>
                <div class="menu-btn-bar"></div>
                <div class="menu-btn-bar"></div>
            </div>
        </div>
        <div id="logo-wrap">
            <div id="logo">Glance</div>
        </div>        

        <div id="input-group-wrap">
           <div id="search-btn-wrap" class="wrap-part">
                <button type="button" class="btn"><img src="images/search.png" /></button>
            </div>        
            <div id="search-bars-wrap" class="wrap-part">
                <div id="search-bar-group">
                    <div id="search-bars">
                        <div class="search-bar-wrap">
                            <input type="text" id="basic-search-bar" class="search-bar" value="{{ query}}" />
                        </div>
                        <div id="vs-wrap">vs</div>
                        <div class="search-bar-wrap">
                            <input type="text" id="compare-search-bar" class="search-bar" value="{{ query2 }}"  />
                        </div>
                    </div>
                </div>   
            </div> <!-- end #search-bars-wrap -->
        </div> <!-- end #input-group-wrap -->
    </div>
</header>

<div id="greeting-wrap" class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        {{#hint}}

        <div class="suggestion-wrap row">
            <a href="{{href}}">
            <div class="question col-lg-12 col-md-12 col-sm-12 col-xs-12">{{question}}</div>

            <div class="suggest col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="arrow-right"></div>
                <span class="word1">{{word1}}</span>
                <span class="vs {{show2}}">vs</span>
                <span class="word2 {{show2}}">{{word2}}</span>
            </div>
            </a>
<!--    
            <div class="suggest word1 {{only_one}} col-lg-{{show1}} col-md-{{show1}} col-sm-{{show1}} col-xs-{{show1}}">
                
            </div>
            <div class="suggest vs {{show2}} col-lg-1 col-md-1 col-sm-1 col-xs-1">
                
            </div>
            <div class="suggest word2 {{show2}} col-lg-5 col-md-5 col-sm-5 col-xs-5">
                
            </div> -->
<!--             <div class="suggest word1">{{word1}}</div>
            <div class="suggest vs {{show2}}">vs</div>
            <div class="suggest word2 {{show2}}">{{word2}}</div> -->
        </div>
        {{/hint}}     
        <!-- <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"></div> -->
    </div>
</div>
