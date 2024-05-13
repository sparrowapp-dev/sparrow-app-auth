<script>
</script>


<div style="height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center;
padding: 48px 48px 64px 48px !important;">
    <div style="position: relative; overflow: hidden; width: max-content; 
    padding: 48px 48px 64px 48px !important;">
        <div style="position: absolute; top: 0; left: 0; height: 100%; width: 100%; background: #8989890D;
            backdrop-filter: blur( 50px );
            -webkit-backdrop-filter: blur( 50px );
            border-radius: 10px;">
        </div>
        <div style="width: 39px;
            height: 104px;
            opacity: 0.156;background: #1392F0;
            border-radius: 100%; position: absolute; top: calc(250px - 72px); left: -20px;
            z-index: -1;
        "></div>
        <div style="width: 305px;
            height: 77px;background: #4165F9;
            opacity: 0.16;
            border-radius: 100%; position: absolute; top: 0; left: calc(250px - 152px); z-index: -1;
        "></div>
        <div style="width: 131px;
            height: 85px;
            opacity: 0.156;background: #5652FD;
            border-radius: 100%; position: absolute; top: calc(250px - 60px); right: 0px; z-index: -1;
        "></div>
        <div style="width: 305px;
            height: 77px;
            opacity: 0.16;background: #376FF7;
            border-radius: 100%; position: absolute; bottom: -35px; left: calc(250px - 150px); z-index: -1;
        "></div>|
        <div style="position: absolute; top: 0; left: 0; z-index: 1; width: 100%; height: 100%;
		padding: 48px 48px 64px 48px !important;"><slot></slot></div>
    </div>
</div>
