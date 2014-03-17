<div class="row">
    <div id="nav-container">
        <div class="list-block" id="logo-wrap-block">
            <div class="logo-wrap">
                <div id="glance-logo">glance</div>
                <span>dictionary visualization</span>
            </div>

        </div>
        <div class="list-block function-nav-block selected" id="nav-greeting">
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
                <div class="content-body">{{display-name}} of <span>word</span></div>
            </div>
            <span class="nav-arrow"></span>
            <span class="nav-arrow-border"></span>
        </div>
        {{/function-list}}
       
     
        <div class="list-block" id="footer">
            <div id="copyright">glance &copy; 2014</div>
            <div class=""><a href="http://nlp.cs.nthu.edu.tw" target=_blank>NTHU nlpLab</a></div>

        </div>
    </div>

    <div id="content-container">
            <div class="function-content header" id="block-greeting">
                <div class="">A Brand new way to <strong>look</strong> up a tedious dictionary !</div>
            </div>
            
            {{#function-list}}
            <div class="function-content block" id="block-{{id}}">
                <!-- <div class="function-label"></div> -->
                <div class="function-tag">{{display-name}}</div>
                <div class="function-aera" id="{{id}}"></div>
            </div>              
            {{/function-list}}

                        
    </div>

</div>