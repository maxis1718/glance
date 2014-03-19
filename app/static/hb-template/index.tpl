<header class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">

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

        <!-- side navigation -->
        <div id="side-nav-wrap">
            <nav class="side-nav">
                <ul class="part hide-part" id="menu-nav">
                    {{#function-list}}
                    <li class="nav-{{ id }}">
                        <div class="nav-full">{{ display-name }}</div>
                    </li>
                    {{/function-list}}
                </ul>
            </nav>
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

<section class="row">
    <div class="col compare-grid grid-header col-lg-6 col-md-6 col-sm-6 col-xs-12">
        <div class="content-wrap">
            <div class="content">
                <article class="content-body query-article">{{query}}</article>
            </div>
        </div>
    </div>
    <div class="col compare-grid grid-header col-lg-6 col-md-6 col-sm-6 col-xs-12">
         <div class="content-wrap">
            <div class="content">
                <article class="content-body query-article">{{query2}}</article>
            </div>
        </div>
    </div>
</section>

{{#function-list}}
<section class="row">
    <div class="col compare-grid grid-body col-lg-6 col-md-6 col-sm-6 col-xs-12">
        <div class="content-wrap">
            <div class="content">
                <div class="content-tag">{{display-name}}</div>
                <article class="content-body {{id}}" id="{{id}}_{{../postfixFirst}}"></article>
            </div>
        </div>
    </div>
    <div class="col compare-grid grid-body col-lg-6 col-md-6 col-sm-6 col-xs-12">
         <div class="content-wrap">
            <div class="content">
                <div class="content-tag">{{display-name}}</div>
                <article class="content-body {{id}}" id="{{id}}_{{../postfixSecond}}"></article>
            </div>
        </div>
    </div>
</section>
{{/function-list}}
