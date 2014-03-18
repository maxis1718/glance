<header class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">



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
    </div>
</header>
<!--         <ul class="menu-wrap">
            <li class="">
                <nav class="gn-menu-wrapper">
                    <div class="gn-scroller">
                        <ul id="main-nav" class="gn-menu">
                            
                            
                            
                        </ul>
                    </div>
                </nav>
           
            </li>
            <li class="logo-wrapper">
                
            </li>
        </ul> -->

{{#function-list}}
<section class="row">
    <article class="col compare-grid col-lg-6 col-md-6 col-sm-6 col-xs-12">
        <div class="content-wrap">
            <div class="content">
                <div class="content-tag">{{display-name}}</div>
                <div class="content-body" id="{{id}}"></div>
            </div>
        </div>
    </article>
    <article class="col compare-grid col-lg-6 col-md-6 col-sm-6 col-xs-12">
         <div class="content-wrap">
            <div class="content">
                <div class="content-tag">{{display-name}}</div>
                <div class="content-body" id="{{id}}"></div>
            </div>
        </div>
    </article>
</section>
{{/function-list}}

<!-- {{#function-list}}
<section class="row">
    <div class="col full-grid col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div class="content-wrap">
            <div class="content">
                <div class="content-tag">{{display-name}}</div>
                <div class="content-body" id="{{id}}"></div>
            </div>
            <hr/>
        </div>
    </div>
</section>
{{/function-list}} -->

<!-- <section class="row">
    <div class="col compare-grid col-lg-6 col-md-6 col-sm-6 col-xs-12">
        <div class="content-wrap">
            <div class="content">
                section 3 - compare left
            </div>            
        </div>
    </div>
    <div class="col compare-grid col-lg-6 col-md-6 col-sm-6 col-xs-12">
        <div class="content-wrap">
            <div class="content">
                section 3 - compare right
            </div>
        </div>
    </div>
</section>
<section class="row">
    <div class="col compare-grid col-lg-6 col-md-6 col-sm-6 col-xs-12">
        <div class="content-wrap">
            <div class="content">
                section 4 - compare left
            </div>            
        </div>
    </div>
    <div class="col compare-grid col-lg-6 col-md-6 col-sm-6 col-xs-12">
        <div class="content-wrap">
            <div class="content">
                section 4 - compare right
            </div>
        </div>
    </div>
</section>
 -->

<!-- <div class="row fill">
    <div class="col fill col-lg-1 col-md-1 col-sm-1 col-xs-1">

        <div class="row" id="nav-wrap">

            <div class="list-block">Glance-logo</div>


            {{#function-list}}
            <div class="list-block function-nav-block" id="nav-{{id}}">
                <div class="function-nav-content">
                    <div class="content-head">{{display-name}}</div>
                </div>
                <span class="nav-arrow"></span>
                <span class="nav-arrow-border"></span>
            </div>
            {{/function-list}}

            <div class="list-block">footer</div>

        </div>

    </div>
    <div class="col fill col-lg-11 col-md-11 col-sm-11 col-xs-11">
        <div class="row" id="content-wrap">


            <div class="row">
                <div class="cblock col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    compare 1
                </div>
                <div class="cblock col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    compare 2
                </div>
            </div>

            <div class="row">
                <div class="cblock col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    merged
                </div>
            </div>


        </div>
    </div>    
</div> -->


<!--  ========================================================================================================= -->


<!-- <div class="col fill" >
    left
    <div class="nav-body">
        
    </div>
</div>
<div class="col fill last-col" >
    <div class="content-body">
        
    </div>
</div> -->
<!-- 
<div id="nav-container">

    <div class="list-block" id="logo-wrap-block">
        G-logo
        <div class="logo-wrap hide">
            <div id="glance-logo">glance</div>
            <span>dictionary visualization</span>
        </div>
    </div>
    <div class="hide" id="nav-greeting">
        <div class="input-wrap">
            <div class="input-area-wrap">
                <input id="input-area" type="text" placeholder="search..."/>
            </div>
            <div class="input-btn-wrap">
                <span class="input-btn">
                    <img src="images/search.png" width="14px" />
                </span>
                <span class="input-btn-triangle"></span>
            </div>
        </div>
        <span class="nav-arrow"></span>
        <span class="nav-arrow-border"></span>                        
    </div>


	{{#function-list}}
    <div class="list-block function-nav-block" id="nav-{{id}}">
        <div class="function-nav-content">
            <div class="content-head">{{display-name}}</div>
        </div>
        <span class="nav-arrow"></span>
        <span class="nav-arrow-border"></span>
    </div>
    {{/function-list}}

    <div class="list-block hide" id="footer">
        <div id="copyright">glance &copy; 2014</div>
        <div class=""><a href="http://nlp.cs.nthu.edu.tw" target=_blank>NTHU nlpLab</a></div>
    </div>
</div>
 -->
